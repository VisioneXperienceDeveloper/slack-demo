'use client';

import styles from './ActivityView.module.css';

export default function ActivityView() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Activity</h2>
      </div>
      <div className={styles.content}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg width="40" height="40" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1" />
              <path d="M8 5V8L10 10" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </div>
          <h3 className={styles.emptyTitle}>Nothing to see here... yet</h3>
          <p className={styles.emptyText}>
            Reactions, mentions, and other notifications will appear in this feed.
          </p>
        </div>
      </div>
    </div>
  );
}
