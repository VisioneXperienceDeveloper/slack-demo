/**
 * Sidebar — Chat Feature Component
 *
 * Left sidebar showing workspace info, channel list,
 * and direct messages section.
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Channel, User, Workspace } from '@/features/chat/domain/models';
import ProfileModal from './ProfileModal';
import CreateChannelModal from './CreateChannelModal';
import CreateDMModal from './CreateDMModal';
import { useSidebar } from '@/shared/contexts/SidebarContext';
import styles from './Sidebar.module.css';

interface DMItem {
  id: string;
  channelId: string;
  otherUser?: User;
}

interface SidebarProps {
  workspace: Workspace;
  channels: Channel[];
  dms?: DMItem[];
  currentChannel: Channel | null;
  currentUser: User;
}

export default function Sidebar({
  workspace,
  channels,
  dms = [],
  currentChannel,
  currentUser,
}: SidebarProps) {
  const pathname = usePathname();
  const { toggle } = useSidebar();
  const [isChannelsOpen, setIsChannelsOpen] = useState(true);
  const [isDMsOpen, setIsDMsOpen] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);
  const [isCreateDMOpen, setIsCreateDMOpen] = useState(false);

  const isThreadsActive = pathname.endsWith('/threads');
  const isActivityActive = pathname.endsWith('/activity');
  const isDMsActive = pathname.endsWith('/dms');

  return (
    <aside className={styles.sidebar}>
      {/* Workspace Header */}
      <div className={styles.workspaceHeader}>
        <div className={styles.workspaceName}>
          <span className={styles.workspaceIcon}>{workspace.name.substring(0, 1).toUpperCase()}</span>
          <h1 className={workspace.name.length > 15 ? styles.workspaceTitleTruncated : styles.workspaceTitle}>{workspace.name}</h1>
        </div>
        <div className={styles.headerActions}>
          <button 
            className={styles.composeBtn} 
            title="New message"
            onClick={() => setIsCreateDMOpen(true)}
          >
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
          <button 
            className={styles.closeSidebarBtn} 
            onClick={() => toggle()}
            title="Close sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link 
              href={`/workspace/${workspace.id}/threads`} 
              className={`${styles.navButton} ${isThreadsActive ? styles.activeNav : ''}`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M2 4H14M2 8H14M2 12H8"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
              <span>Threads</span>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link 
              href={`/workspace/${workspace.id}/activity`} 
              className={`${styles.navButton} ${isActivityActive ? styles.activeNav : ''}`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.2" />
                <path d="M8 5V8L10 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <span>Activity</span>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link 
              href={`/workspace/${workspace.id}/dms`} 
              className={`${styles.navButton} ${isDMsActive ? styles.activeNav : ''}`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 3L6.5 13L8 8L13 6.5L3 3Z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
              </svg>
              <span>DMs</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className={styles.scrollable}>
        {/* Channels Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <button 
              className={styles.sectionToggle}
              onClick={() => setIsChannelsOpen(!isChannelsOpen)}
            >
              <svg 
                width="10" height="10" viewBox="0 0 10 10" fill="none" 
                className={`${styles.chevron} ${!isChannelsOpen ? styles.chevronClosed : ''}`}
              >
                <path d="M3 4L5 6L7 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <span>Channels</span>
            </button>
            <button 
              className={styles.addBtn} 
              title="Create channel"
              onClick={() => setIsCreateChannelOpen(true)}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 3V11M3 7H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          {isChannelsOpen && (
            <ul className={styles.channelList}>
              {channels.map((channel) => (
                <li key={channel.id}>
                  <Link
                    href={`/workspace/${workspace.id}/channel/${channel.id}`}
                    className={`${styles.channelItem} ${
                      currentChannel?.id === channel.id ? styles.active : ''
                    }`}
                  >
                    {channel.isPrivate ? (
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className={styles.lockIcon}>
                        <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                        <path d="M5 7V5C5 3.3 6.3 2 8 2C9.7 2 11 3.3 11 5V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <span className={styles.hash}>#</span>
                    )}
                    <span className={styles.channelName}>{channel.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Direct Messages Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <button 
              className={styles.sectionToggle}
              onClick={() => setIsDMsOpen(!isDMsOpen)}
            >
              <svg 
                width="10" height="10" viewBox="0 0 10 10" fill="none" 
                className={`${styles.chevron} ${!isDMsOpen ? styles.chevronClosed : ''}`}
              >
                <path d="M3 4L5 6L7 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <span>Direct Messages</span>
            </button>
            <button 
              className={styles.addBtn} 
              title="New DM"
              onClick={() => setIsCreateDMOpen(true)}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 3V11M3 7H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          {isDMsOpen && (
            <ul className={styles.channelList}>
              {dms.map((dm) => (
                <li key={dm.id}>
                  <Link
                    href={`/workspace/${workspace.id}/channel/${dm.channelId}`}
                    className={`${styles.channelItem} ${
                      currentChannel?.id === dm.channelId ? styles.active : ''
                    }`}
                  >
                    <span className={styles.dmAvatar}>
                      {dm.otherUser?.displayName?.substring(0, 1).toUpperCase() || '?'}
                      <span 
                        className={styles.dmStatusDot}
                        style={{ 
                          backgroundColor: dm.otherUser?.status === 'online' 
                            ? 'var(--status-online)' 
                            : 'var(--status-offline)' 
                        }}
                      />
                    </span>
                    <span className={styles.channelName}>{dm.otherUser?.displayName || 'Unknown'}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* User Section */}
      <div className={styles.userSection}>
        <button 
          className={styles.userSectionBtn}
          onClick={() => setIsProfileModalOpen(true)}
        >
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
        </button>
      </div>

      <ProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={currentUser}
      />

      <CreateChannelModal
        isOpen={isCreateChannelOpen}
        onClose={() => setIsCreateChannelOpen(false)}
        workspaceId={workspace.id}
      />

      <CreateDMModal
        isOpen={isCreateDMOpen}
        onClose={() => setIsCreateDMOpen(false)}
        workspaceId={workspace.id}
      />
    </aside>
  );
}
