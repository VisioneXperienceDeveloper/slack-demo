'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import type { Channel } from '@/features/chat/domain/models';
import MembersModal from './MembersModal';
import ChannelSettingsModal from './ChannelSettingsModal';
import InviteChannelModal from './InviteChannelModal';
import styles from './ChatHeader.module.css';

interface ChatHeaderProps {
  channel: Channel | null;
}

export default function ChatHeader({ channel }: ChatHeaderProps) {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspaceId as string;

  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = useQuery(
    api.messages.search,
    searchQuery.length >= 2 && channel
      ? { 
          workspaceId: workspaceId as Id<"workspaces">, 
          query: searchQuery, 
          channelId: channel.id as Id<"channels"> 
        } 
      : "skip"
  );


  if (!channel) return null;

  return (
    <header className={styles.header}>
      {isSearchOpen ? (
        <div className={styles.searchContainer}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={styles.searchIcon}>
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            autoFocus
            type="text"
            placeholder={`Search in #${channel.name}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <button 
            className={styles.closeBtn} 
            onClick={() => {
              setIsSearchOpen(false);
              setSearchQuery("");
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M4 4L10 10M4 10L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          
          {searchQuery.length >= 2 && (
            <div className={styles.resultsDropdown}>
              {searchResults === undefined ? (
                <div className={styles.status}>Searching...</div>
              ) : searchResults.length === 0 ? (
                <div className={styles.status}>No results found</div>
              ) : (
              searchResults.map((res: { 
                _id: string; 
                channelId: string; 
                body: string; 
                author: { name?: string } | null 
              }) => (
                  <button
                    key={res._id}
                    className={styles.resultItem}
                    onClick={() => {
                      router.push(`/workspace/${workspaceId}/channel/${res.channelId}?messageId=${res._id}`);
                      setIsSearchOpen(false);
                      setSearchQuery("");
                    }}
                  >
                    <div className={styles.resultMeta}>
                      <span className={styles.resultAuthor}>{res.author?.name || "Unknown"}</span>
                    </div>

                    <div className={styles.resultBody}>{res.body}</div>
                  </button>
                ))

              )}
            </div>
          )}
        </div>
      ) : (
        <>
          <div className={styles.left}>
            <div className={styles.channelInfo}>
              <h2 className={styles.channelName}>
                {channel.isPrivate ? (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className={styles.lockIcon} style={{ marginRight: '4px' }}>
                    <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M5 7V5C5 3.3 6.3 2 8 2C9.7 2 11 3.3 11 5V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                ) : (
                  <span className={styles.hash}>#</span>
                )}
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
            <button 
              className={styles.actionBtn} 
              title="Members"
              onClick={() => setIsMembersOpen(true)}
            >
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

            {channel.isPrivate && (
              <button 
                className={styles.actionBtn} 
                title="Add people"
                onClick={() => setIsInviteOpen(true)}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            )}

            <button 
              className={styles.actionBtn} 
              title="Search"
              onClick={() => setIsSearchOpen(true)}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.2" />
                <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>

            <button 
              className={styles.actionBtn} 
              title="Channel settings"
              onClick={() => setIsSettingsOpen(true)}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="4" r="1" fill="currentColor" />
                <circle cx="8" cy="8" r="1" fill="currentColor" />
                <circle cx="8" cy="12" r="1" fill="currentColor" />
              </svg>
            </button>
          </div>
        </>
      )}

      <MembersModal 
        isOpen={isMembersOpen} 
        onClose={() => setIsMembersOpen(false)} 
        workspaceId={workspaceId}
      />

      <ChannelSettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        channel={channel}
      />

      <InviteChannelModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        workspaceId={workspaceId}
        channelId={channel.id}
      />
    </header>
  );
}
