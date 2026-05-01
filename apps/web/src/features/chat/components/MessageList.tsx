/**
 * MessageList — Chat Feature Component
 *
 * Scrollable container for chat messages.
 * Groups consecutive messages from the same author
 * into compact mode.
 */

'use client';

import { useEffect, useRef, useMemo } from 'react';
import type { Message, User } from '@/features/chat/domain/models';
import MessageBubble from './MessageBubble';
import styles from './MessageList.module.css';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onReact?: (messageId: string, emoji: string) => void;
  onThreadClick?: (messageId: string) => void;
  onEdit?: (messageId: string, body: string) => void;
  onDelete?: (messageId: string) => void;
  currentUser?: User;
}

/**
 * Determines if a message should be rendered in compact mode
 * (same author, within 5 minutes of previous message)
 */
function shouldBeCompact(current: Message, previous: Message | undefined): boolean {
  if (!previous) return false;
  if (current.author.id !== previous.author.id) return false;
  const timeDiff = current.timestamp.getTime() - previous.timestamp.getTime();
  return timeDiff < 5 * 60 * 1000; // 5 minutes
}

function formatDateDivider(date: Date): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

/** Precompute which messages should show a date divider */
function computeDateDividers(messages: Message[]): Set<string> {
  const dividerIds = new Set<string>();
  let lastDate: string | null = null;
  for (const msg of messages) {
    const dateStr = msg.timestamp.toDateString();
    if (dateStr !== lastDate) {
      dividerIds.add(msg.id);
      lastDate = dateStr;
    }
  }
  return dividerIds;
}

export default function MessageList({ 
  messages, 
  isLoading, 
  onReact, 
  onThreadClick,
  onEdit,
  onDelete,
  currentUser 
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // Precompute date dividers outside of render mapping
  const dateDividerIds = useMemo(() => computeDateDividers(messages), [messages]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.skeleton} />
          <div className={styles.skeleton} />
          <div className={styles.skeleton} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.messages}>
        {messages.map((message, index) => {
          const showDateDivider = dateDividerIds.has(message.id);
          const isCompact = !showDateDivider && shouldBeCompact(message, messages[index - 1]);

          return (
            <div key={message.id}>
              {showDateDivider && (
                <div className={styles.dateDivider}>
                  <span className={styles.dateLine} />
                  <span className={styles.dateLabel}>
                    {formatDateDivider(message.timestamp)}
                  </span>
                  <span className={styles.dateLine} />
                </div>
              )}
              <MessageBubble 
                message={message} 
                isCompact={isCompact} 
                onReact={onReact}
                onThreadClick={onThreadClick}
                onEdit={onEdit}
                onDelete={onDelete}
                currentUser={currentUser}
              />
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
