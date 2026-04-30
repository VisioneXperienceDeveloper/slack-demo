/**
 * MessageBubble — Chat Feature Component
 *
 * Renders a single message with avatar, author name,
 * timestamp, content, reactions, and thread indicator.
 */

import type { Message } from '@/features/chat/domain/models';
import Avatar from '@/shared/components/Avatar';
import styles from './MessageBubble.module.css';

interface MessageBubbleProps {
  message: Message;
  isCompact?: boolean; // Consecutive messages from same author
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return formatTime(date);
}

export default function MessageBubble({ message, isCompact = false }: MessageBubbleProps) {
  return (
    <div className={`${styles.message} ${isCompact ? styles.compact : ''}`}>
      {!isCompact ? (
        <div className={styles.avatarCol}>
          <Avatar user={message.author} size="md" />
        </div>
      ) : (
        <div className={styles.timestampCol}>
          <span className={styles.hoverTime}>{formatTime(message.timestamp)}</span>
        </div>
      )}

      <div className={styles.content}>
        {!isCompact && (
          <div className={styles.meta}>
            <span className={styles.authorName}>{message.author.displayName}</span>
            <span className={styles.timestamp}>
              {formatRelativeTime(message.timestamp)}
            </span>
            {message.isEdited && (
              <span className={styles.edited}>(edited)</span>
            )}
          </div>
        )}

        <p className={styles.text}>{message.content}</p>

        {/* Reactions */}
        {message.reactions.length > 0 && (
          <div className={styles.reactions}>
            {message.reactions.map((reaction, i) => (
              <button key={i} className={styles.reaction}>
                <span className={styles.emoji}>{reaction.emoji}</span>
                <span className={styles.reactionCount}>{reaction.count}</span>
              </button>
            ))}
          </div>
        )}

        {/* Thread indicator */}
        {message.threadCount && message.threadCount > 0 && (
          <button className={styles.thread}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 3H12M2 7H8M2 11H10"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
            <span>{message.threadCount} {message.threadCount === 1 ? 'reply' : 'replies'}</span>
          </button>
        )}
      </div>

      {/* Hover actions */}
      <div className={styles.hoverActions}>
        <button className={styles.hoverBtn} title="React">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1" />
            <circle cx="5.5" cy="6" r="0.7" fill="currentColor" />
            <circle cx="8.5" cy="6" r="0.7" fill="currentColor" />
            <path d="M5 9C5.5 9.8 6.2 10 7 10C7.8 10 8.5 9.8 9 9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          </svg>
        </button>
        <button className={styles.hoverBtn} title="Reply in thread">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 3H12M2 7H8M2 11H10"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <button className={styles.hoverBtn} title="More actions">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="3" cy="7" r="1" fill="currentColor" />
            <circle cx="7" cy="7" r="1" fill="currentColor" />
            <circle cx="11" cy="7" r="1" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>
  );
}
