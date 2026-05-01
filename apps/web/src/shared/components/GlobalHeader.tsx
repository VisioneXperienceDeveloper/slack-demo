'use client';

import { useSidebar } from '@/shared/contexts/SidebarContext';
import styles from './GlobalHeader.module.css';

export default function GlobalHeader() {
  const { toggle } = useSidebar();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button className={styles.menuBtn} onClick={() => toggle()}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3 5H15M3 9H15M3 13H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className={styles.center}>
        <span className={styles.serviceName}>VisionXperience</span>
      </div>

      <div className={styles.right}>
        {/* Placeholder for right side actions */}
      </div>
    </header>
  );
}
