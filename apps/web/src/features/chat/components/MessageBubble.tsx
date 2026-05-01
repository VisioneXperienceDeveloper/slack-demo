/**
 * MessageBubble — Chat Feature Component
 *
 * Renders a single message with avatar, author name,
 * timestamp, content, reactions, and thread indicator.
 */

'use client';

import { useState, useRef } from 'react';
import type { Message, User } from '@/features/chat/domain/models';
import Avatar from '@/shared/components/Avatar';
import MarkdownText from '@/shared/components/MarkdownText';
import EmojiPicker from './EmojiPicker';
import MessageImage from './MessageImage';
import MessageActionsMenu from './MessageActionsMenu';
import styles from './MessageBubble.module.css';

interface MessageBubbleProps {
  message: Message;
  isCompact?: boolean;
  onReact?: (messageId: string, emoji: string) => void;
  onThreadClick?: (messageId: string) => void;
  onEdit?: (messageId: string, body: string) => void;
  onDelete?: (messageId: string) => void;
  currentUser?: User;
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

export default function MessageBubble({ 
  message, 
  isCompact = false,
  onReact,
  onThreadClick,
  onEdit,
  onDelete,
  currentUser,
}: MessageBubbleProps) {
  const [pickerPosition, setPickerPosition] = useState<{ top: number; left: number } | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const reactBtnRef = useRef<HTMLButtonElement>(null);
  const moreBtnRef = useRef<HTMLButtonElement>(null);

  const handleReactClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (pickerPosition) {
      setPickerPosition(null);
    } else {
      const rect = reactBtnRef.current?.getBoundingClientRect();
      if (rect) {
        setPickerPosition({ top: rect.bottom + 8, left: rect.left - 100 });
      }
    }
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (menuPosition) {
      setMenuPosition(null);
    } else {
      const rect = moreBtnRef.current?.getBoundingClientRect();
      if (rect) {
        setMenuPosition({ top: rect.bottom + 4, left: rect.left - 130 });
      }
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    onReact?.(message.id, emoji);
    setPickerPosition(null);
  };

  const isOwner = currentUser?.id === message.author.id;

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

        <MarkdownText text={message.content} />

        {message.image && (
          <MessageImage storageId={message.image} />
        )}

        {/* Reactions */}
        {message.reactions.length > 0 && (
          <div className={styles.reactions}>
            {message.reactions.map((reaction, i) => (
              <button 
                key={i} 
                className={`${styles.reaction} ${reaction.userIds?.includes(currentUser?.id || '') ? styles.reactionActive : ''}`}
                onClick={() => onReact?.(message.id, reaction.emoji)}
                type="button"
              >
                <span className={styles.emoji}>{reaction.emoji}</span>
                <span className={styles.reactionCount}>{reaction.count}</span>
              </button>
            ))}
          </div>
        )}

        {/* Thread indicator */}
        {(message.threadCount ?? 0) > 0 && (
          <button className={styles.thread} onClick={() => onThreadClick?.(message.id)} type="button">
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
        <button 
          className={styles.hoverBtn} 
          title="React" 
          onClick={handleReactClick}
          ref={reactBtnRef}
          type="button"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1" />
            <circle cx="5.5" cy="6" r="0.7" fill="currentColor" />
            <circle cx="8.5" cy="6" r="0.7" fill="currentColor" />
            <path d="M5 9C5.5 9.8 6.2 10 7 10C7.8 10 8.5 9.8 9 9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          </svg>
        </button>
        <button 
          className={styles.hoverBtn} 
          title="Reply in thread"
          onClick={() => onThreadClick?.(message.id)}
          type="button"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 3H12M2 7H8M2 11H10"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <button 
          className={styles.hoverBtn} 
          title="More actions" 
          type="button"
          onClick={handleMoreClick}
          ref={moreBtnRef}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="3" cy="7" r="1" fill="currentColor" />
            <circle cx="7" cy="7" r="1" fill="currentColor" />
            <circle cx="11" cy="7" r="1" fill="currentColor" />
          </svg>
        </button>
      </div>

      {pickerPosition && (
        <EmojiPicker 
          onSelect={handleEmojiSelect} 
          onClose={() => setPickerPosition(null)} 
          position={pickerPosition} 
        />
      )}

      {menuPosition && (
        <MessageActionsMenu
          onClose={() => setMenuPosition(null)}
          onEdit={() => {
            onEdit?.(message.id, message.content);
            setMenuPosition(null);
          }}
          onDelete={() => {
            onDelete?.(message.id);
            setMenuPosition(null);
          }}
          onCopyLink={() => {
            navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?messageId=${message.id}`);
            setMenuPosition(null);
          }}
          position={menuPosition}
          isOwner={isOwner}
        />
      )}
    </div>
  );
}
