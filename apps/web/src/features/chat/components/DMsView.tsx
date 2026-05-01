'use client';

import styles from './DMsView.module.css';

export default function DMsView() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Direct Messages</h2>
      </div>
      <div className={styles.content}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg width="40" height="40" viewBox="0 0 16 16" fill="none">
              <path d="M3 3L6.5 13L8 8L13 6.5L3 3Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className={styles.emptyTitle}>Your DMs</h3>
          <p className={styles.emptyText}>
            Select a member from the sidebar or search to start a new private conversation.
          </p>
        </div>
      </div>
    </div>
  );
}
