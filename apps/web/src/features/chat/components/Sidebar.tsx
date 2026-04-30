/**
 * Sidebar — Chat Feature Component
 *
 * Left sidebar showing workspace info, channel list,
 * and direct messages section.
 */

'use client';

import type { Channel, User } from '@/features/chat/domain/models';
import styles from './Sidebar.module.css';

interface SidebarProps {
  channels: Channel[];
  currentChannel: Channel | null;
  currentUser: User;
  onChannelSelect: (channel: Channel) => void;
}

export default function Sidebar({
  channels,
  currentChannel,
  currentUser,
  onChannelSelect,
}: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      {/* Workspace Header */}
      <div className={styles.workspaceHeader}>
        <div className={styles.workspaceName}>
          <span className={styles.workspaceIcon}>S</span>
          <h1 className={styles.workspaceTitle}>Slack Clone</h1>
        </div>
        <button className={styles.composeBtn} title="New message">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M13.5 3.5L12.5 2.5L5 10V11H6L13.5 3.5Z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2.5 13.5H13.5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <button className={styles.navButton}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M2 4H14M2 8H14M2 12H8"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
              <span>Threads</span>
            </button>
          </li>
          <li className={styles.navItem}>
            <button className={styles.navButton}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.2" />
                <path d="M8 5V8L10 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <span>Activity</span>
            </button>
          </li>
          <li className={styles.navItem}>
            <button className={styles.navButton}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 3L6.5 13L8 8L13 6.5L3 3Z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
              </svg>
              <span>DMs</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Channels Section */}
      <div className={styles.section}>
        <button className={styles.sectionHeader}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={styles.chevron}>
            <path d="M3 4L5 6L7 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <span>Channels</span>
        </button>
        <ul className={styles.channelList}>
          {channels.map((channel) => (
            <li key={channel.id}>
              <button
                className={`${styles.channelItem} ${
                  currentChannel?.id === channel.id ? styles.active : ''
                }`}
                onClick={() => onChannelSelect(channel)}
              >
                <span className={styles.hash}>#</span>
                <span className={styles.channelName}>{channel.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* User Section */}
      <div className={styles.userSection}>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            <span className={styles.userInitial}>
              {currentUser.displayName[0]}
            </span>
            <span
              className={styles.userStatus}
              style={{
                backgroundColor:
                  currentUser.status === 'online'
                    ? 'var(--status-online)'
                    : 'var(--status-offline)',
              }}
            />
          </div>
          <div className={styles.userMeta}>
            <span className={styles.userName}>{currentUser.displayName}</span>
            <span className={styles.userStatusText}>
              {currentUser.status === 'online' ? 'Active' : 'Away'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
