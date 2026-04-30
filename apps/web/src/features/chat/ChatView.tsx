/**
 * ChatView — Chat Feature Container
 *
 * Main container that orchestrates the chat feature.
 * Manages state, service calls, and composes all
 * chat sub-components together.
 */

'use client';

import { useState, useCallback } from 'react';
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
  
  const sendMessage = useMutation(api.messages.send);
  const toggleReaction = useMutation(api.reactions.toggle);
  
  const [isSending, setIsSending] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

  // ─── Send Message ─────────────────────────────────────

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!channel || !currentUser || isSending) return;

      setIsSending(true);
      try {
        await sendMessage({
          workspaceId: workspaceId as Id<"workspaces">,
          channelId: channelId as Id<"channels">,
          body: content,
        });
      } finally {
        setIsSending(false);
      }
    },
    [workspaceId, channelId, channel, currentUser, isSending, sendMessage],
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
    <div className={styles.layout} style={{ gridTemplateColumns: selectedThreadId ? '1fr 380px' : '1fr' }}>
      <main className={styles.main}>
        <ChatHeader channel={{
          id: channel._id,
          workspaceId: channel.workspaceId,
          name: channel.name,
          description: channel.description,
          isPrivate: channel.isPrivate,
          memberCount: 0,
          createdAt: new Date(channel.createdAt)
        }} />
        <MessageList 
          messages={mappedMessages} 
          isLoading={status === "LoadingFirstPage"} 
          onReact={handleReact}
          onThreadClick={handleThreadClick}
        />
        <MessageInput
          channelName={channel.name}
          onSend={handleSendMessage}
          disabled={isSending}
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
