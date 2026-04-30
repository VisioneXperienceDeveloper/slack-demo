'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import type { Message } from '@/features/chat/domain/models';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import styles from './ThreadPanel.module.css';

interface ThreadPanelProps {
  workspaceId: string;
  channelId: string;
  parentMessageId: string;
  onClose: () => void;
}

export default function ThreadPanel({ workspaceId, channelId, parentMessageId, onClose }: ThreadPanelProps) {
  const threadData = useQuery(api.messages.listThread, { parentMessageId: parentMessageId as Id<"messages"> });
  const sendMessage = useMutation(api.messages.send);
  const toggleReaction = useMutation(api.reactions.toggle);
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threadData?.replies?.length]);

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (isSending) return;
      setIsSending(true);
      try {
        await sendMessage({
          workspaceId: workspaceId as Id<"workspaces">,
          channelId: channelId as Id<"channels">,
          body: content,
          parentMessageId: parentMessageId as Id<"messages">,
        });
      } finally {
        setIsSending(false);
      }
    },
    [workspaceId, channelId, parentMessageId, isSending, sendMessage],
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

  if (threadData === undefined) {
    return (
      <aside className={styles.panel}>
        <div className={styles.header}>
          <h2>Thread</h2>
          <button className={styles.closeBtn} onClick={onClose} type="button">×</button>
        </div>
        <div className={styles.loading}>Loading...</div>
      </aside>
    );
  }

  const { parentMessage, replies } = threadData;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapConvexMessage = (msg: any): Message => ({
    id: msg._id,
    channelId: msg.channelId,
    workspaceId: msg.workspaceId,
    author: {
      id: msg.author?._id || 'unknown',
      name: msg.author?.name || 'Anonymous',
      displayName: msg.author?.name || 'Anonymous',
      avatarUrl: msg.author?.image,
      status: 'online',
    },
    content: msg.body,
    timestamp: new Date(msg._creationTime),
    isEdited: !!msg.updatedAt,
    reactions: msg.reactions || [],
    threadCount: msg.threadCount || 0,
    parentMessageId: msg.parentMessageId,
  });

  const parentDomainMsg = mapConvexMessage(parentMessage);
  const mappedReplies = replies.map(mapConvexMessage);

  return (
    <aside className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h2>Thread</h2>
          <span className={styles.channelName}>#channel</span>
        </div>
        <button className={styles.closeBtn} onClick={onClose} type="button">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 12L12 4M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.parentMessage}>
          <MessageBubble message={parentDomainMsg} onReact={handleReact} />
        </div>

        <div className={styles.divider}>
          <span className={styles.dividerCount}>{replies.length} replies</span>
          <span className={styles.dividerLine} />
        </div>

        <div className={styles.replies}>
          {mappedReplies.map((reply, i) => {
            const isCompact = i > 0 && reply.author.id === mappedReplies[i - 1].author.id && 
                              (reply.timestamp.getTime() - mappedReplies[i - 1].timestamp.getTime() < 5 * 60 * 1000);
            return (
              <MessageBubble 
                key={reply.id} 
                message={reply} 
                isCompact={isCompact} 
                onReact={handleReact}
              />
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className={styles.inputWrapper}>
        <MessageInput 
          channelName="thread" 
          onSend={handleSendMessage} 
          disabled={isSending} 
        />
      </div>
    </aside>
  );
}
