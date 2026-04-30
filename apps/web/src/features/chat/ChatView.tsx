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
import { api } from '../../../../../convex/_generated/api';
import type { Id } from '../../../../../convex/_generated/dataModel';
import type { Message } from './domain/models';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
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
  const [isSending, setIsSending] = useState(false);

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
    reactions: [], // Not implemented in schema yet
  })).reverse(); // Paginated query returns desc, we want asc for display

  return (
    <div className={styles.layout} style={{ gridTemplateColumns: '1fr' }}>
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
        <MessageList messages={mappedMessages} isLoading={status === "LoadingFirstPage"} />
        <MessageInput
          channelName={channel.name}
          onSend={handleSendMessage}
          disabled={isSending}
        />
      </main>
    </div>
  );
}
