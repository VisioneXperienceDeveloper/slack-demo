'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useQuery, useMutation, usePaginatedQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import type { Message } from './domain/models';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import ThreadPanel from './components/ThreadPanel';
import styles from './ChatView.module.css';

interface ChatViewProps {
  workspaceId: string;
  channelId: string;
}

const MESSAGES_PER_PAGE = 50;

export default function ChatView({ workspaceId, channelId }: ChatViewProps) {
  const channel = useQuery(api.channels.get, { channelId: channelId as Id<"channels"> });
  const currentUser = useQuery(api.users.viewer);
  const { results: rawMessages, status } = usePaginatedQuery(
    api.messages.list,
    { channelId: channelId as Id<"channels"> },
    { initialNumItems: MESSAGES_PER_PAGE }
  );
  const workspaceUsers = useQuery(api.users.list, { workspaceId: workspaceId as Id<"workspaces"> });
  
  const generateUploadUrl = useMutation(api.upload.generateUploadUrl);
  const sendMessage = useMutation(api.messages.send);
  const toggleReaction = useMutation(api.reactions.toggle);
  const updateMessage = useMutation(api.messages.update);
  const removeMessage = useMutation(api.messages.remove);
  
  const [isSending, setIsSending] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<Id<"messages"> | null>(null);
  const [editingBody, setEditingBody] = useState("");
  const lastMessageId = useRef<string | null>(null);

  // ─── Notifications ────────────────────────────────────

  useEffect(() => {
    if (typeof window !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (rawMessages.length > 0) {
      const latest = rawMessages[0];
      if (lastMessageId.current && latest._id !== lastMessageId.current) {
        // Don't notify for our own messages
        if (latest.authorId !== currentUser?._id && document.hidden) {
          if (Notification.permission === 'granted') {
            new Notification(`New message in #${channel?.name}`, {
              body: `${latest.author?.name}: ${latest.body}`,
              icon: latest.author?.image,
            });
          }
        }
      }
      lastMessageId.current = latest._id;
    }
  }, [rawMessages, channel, currentUser]);

  // ─── Send Message ─────────────────────────────────────

  const handleSendMessage = useCallback(
    async (content: string, image?: File) => {
      if ((!content.trim() && !image) || !channel || !currentUser || isSending) return;

      setIsSending(true);
      try {
        if (editingMessageId) {
          await updateMessage({
            id: editingMessageId,
            body: content,
          });
          setEditingMessageId(null);
          setEditingBody("");
        } else {
          let storageId: Id<"_storage"> | undefined;

          if (image) {
            const url = await generateUploadUrl();
            const result = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": image.type },
              body: image,
            });
            const { storageId: uploadedId } = await result.json();
            storageId = uploadedId;
          }

          await sendMessage({
            workspaceId: workspaceId as Id<"workspaces">,
            channelId: channelId as Id<"channels">,
            body: content,
            image: storageId,
          });
        }
      } catch (error) {
        console.error("Failed to send/update message:", error);
      } finally {
        setIsSending(false);
      }
    },
    [workspaceId, channelId, channel, currentUser, isSending, sendMessage, generateUploadUrl, editingMessageId, updateMessage],
  );

  const handleReact = useCallback(
    async (messageId: string, emoji: string) => {
      try {
        await toggleReaction({
          messageId: messageId as Id<"messages">,
          emoji,
        });
      } catch (error) {
        console.error("Failed to toggle reaction:", error);
      }
    },
    [toggleReaction]
  );

  const handleEdit = useCallback((messageId: string, body: string) => {
    setEditingMessageId(messageId as Id<"messages">);
    setEditingBody(body);
  }, []);

  const handleDelete = useCallback(async (messageId: string) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await removeMessage({ id: messageId as Id<"messages"> });
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  }, [removeMessage]);

  const handleThreadClick = useCallback((messageId: string) => {
    setSelectedThreadId(messageId);
  }, []);

  // ─── Render ───────────────────────────────────────────

  if (currentUser === undefined || channel === undefined) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingSpinner} />
        <p className={styles.loadingText}>Loading channel...</p>
      </div>
    );
  }

  if (!currentUser || !channel) {
    return (
      <div className={styles.loadingScreen}>
        <p className={styles.loadingText}>Channel not found or unauthorized.</p>
      </div>
    );
  }

  // Map Convex messages to Domain Models
  const mappedMessages: Message[] = rawMessages.map((msg) => ({
    id: msg._id,
    channelId: msg.channelId,
    workspaceId: msg.workspaceId,
    author: {
      id: msg.author?._id || 'unknown',
      name: msg.author?.name || 'Anonymous',
      displayName: msg.author?.name || 'Anonymous',
      avatarUrl: msg.author?.image,
      status: 'online' as const,
    },
    content: msg.body,
    timestamp: new Date(msg._creationTime),
    isEdited: !!msg.updatedAt,
    reactions: msg.reactions || [],
    threadCount: msg.threadCount || 0,
    parentMessageId: msg.parentMessageId,
    image: msg.image,
  })).reverse(); // Paginated query returns desc, we want asc for display

  return (
    <div className={`${styles.layout} ${selectedThreadId ? styles.threadOpen : ''}`}>
      <main className={styles.main}>
        <ChatHeader channel={{
          id: channel._id,
          workspaceId: channel.workspaceId,
          name: channel.name,
          description: channel.description,
          isPrivate: channel.isPrivate,
          memberCount: workspaceUsers?.length || 0,
          createdAt: new Date(channel.createdAt)
        }} />
        <MessageList 
          messages={mappedMessages} 
          isLoading={status === "LoadingFirstPage"} 
          onReact={handleReact}
          onThreadClick={handleThreadClick}
          onEdit={handleEdit}
          onDelete={handleDelete}
          currentUser={{
            id: currentUser._id,
            name: currentUser.name || 'Anonymous',
            displayName: currentUser.name || 'Anonymous',
            avatarUrl: currentUser.image,
            status: 'online' as const,
          }}
        />
        <MessageInput
          key={editingMessageId || 'new'}
          channelName={channel.name}
          onSend={handleSendMessage}
          disabled={isSending}
          initialValue={editingBody}
          isEditing={!!editingMessageId}
          onCancelEdit={() => {
            setEditingMessageId(null);
            setEditingBody("");
          }}
        />
      </main>
      
      {selectedThreadId && (
        <ThreadPanel 
          workspaceId={workspaceId}
          channelId={channelId}
          parentMessageId={selectedThreadId}
          onClose={() => setSelectedThreadId(null)}
        />
      )}
    </div>
  );
}
