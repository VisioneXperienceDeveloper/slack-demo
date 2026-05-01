'use client';

import styles from './ThreadsView.module.css';

export default function ThreadsView() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Threads</h2>
      </div>
      <div className={styles.content}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg width="40" height="40" viewBox="0 0 16 16" fill="none">
              <path d="M2 4H14M2 8H14M2 12H8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </div>
          <h3 className={styles.emptyTitle}>No threads yet</h3>
          <p className={styles.emptyText}>
            When you reply to a message or someone mentions you in a thread, it will show up here.
          </p>
        </div>
      </div>
    </div>
  );
}
