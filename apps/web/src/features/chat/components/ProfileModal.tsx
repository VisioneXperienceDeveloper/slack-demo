'use client';

import { useClerk } from '@clerk/nextjs';
import Modal from '@/shared/components/Modal';
import Avatar from '@/shared/components/Avatar';
import type { User } from '@/features/chat/domain/models';
import styles from './ProfileModal.module.css';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export default function ProfileModal({ isOpen, onClose, user }: ProfileModalProps) {
  const { signOut } = useClerk();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Profile"
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <Avatar user={user} size="lg" />
          <div className={styles.meta}>
            <h2 className={styles.name}>{user.displayName}</h2>
            <span className={styles.status}>
              <span className={`${styles.statusDot} ${styles[user.status]}`} />
              {user.status === 'online' ? 'Active' : 'Away'}
            </span>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Account</h3>
          <div className={styles.infoItem}>
            <span className={styles.label}>Display Name</span>
            <span className={styles.value}>{user.displayName}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <button 
            className={styles.logoutBtn}
            onClick={() => signOut()}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3H12C13.1 3 14 3.9 14 5V11C14 12.1 13.1 13 12 13H10M6 11L9 8L6 5M9 8H2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Sign Out
          </button>
        </div>
      </div>
    </Modal>
  );
}
