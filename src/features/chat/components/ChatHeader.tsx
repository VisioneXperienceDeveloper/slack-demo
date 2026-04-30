/**
 * ChatHeader — Chat Feature Component
 *
 * Displays the current channel name, description,
 * and action buttons (search, members, settings).
 */

import type { Channel } from '@/features/chat/domain/models';
import styles from './ChatHeader.module.css';

interface ChatHeaderProps {
  channel: Channel | null;
}

export default function ChatHeader({ channel }: ChatHeaderProps) {
  if (!channel) return null;

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.channelInfo}>
          <h2 className={styles.channelName}>
            <span className={styles.hash}>#</span>
            {channel.name}
          </h2>
          {channel.description && (
            <>
              <span className={styles.divider} />
              <p className={styles.description}>{channel.description}</p>
            </>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.actionBtn} title="Members">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
            <path
              d="M1.5 13.5C1.5 10.5 3.5 9 6 9C8.5 9 10.5 10.5 10.5 13.5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <circle cx="11" cy="5.5" r="2" stroke="currentColor" strokeWidth="1.2" />
            <path
              d="M11 9C12.8 9 14.5 10.2 14.5 13"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
          <span className={styles.memberCount}>{channel.memberCount}</span>
        </button>

        <button className={styles.actionBtn} title="Search">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>

        <button className={styles.actionBtn} title="Channel settings">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="4" r="1" fill="currentColor" />
            <circle cx="8" cy="8" r="1" fill="currentColor" />
            <circle cx="8" cy="12" r="1" fill="currentColor" />
          </svg>
        </button>
      </div>
    </header>
  );
}
