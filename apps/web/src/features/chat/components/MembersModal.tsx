import { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import Modal from '@/shared/components/Modal';
import Avatar from '@/shared/components/Avatar';
import styles from './MembersModal.module.css';

interface MembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
}

export default function MembersModal({ isOpen, onClose, workspaceId }: MembersModalProps) {
  const users = useQuery(api.users.list, { workspaceId: workspaceId as Id<"workspaces"> });
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);
  const ONLINE_THRESHOLD = 120000; // 2 minutes

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Members"
    >
      <div className={styles.container}>
        <div className={styles.searchBox}>
          <input type="text" placeholder="Find members" className={styles.searchInput} />
        </div>
        <div className={styles.list}>
          {users === undefined ? (
            <div className={styles.loading}>Loading members...</div>
          ) : users.length === 0 ? (
            <div className={styles.empty}>No members found.</div>
          ) : (
            users.map((user) => {
              const isOnline = user.lastSeen && now - user.lastSeen < ONLINE_THRESHOLD;
              return (
                <div key={user._id} className={styles.memberItem}>
                  <div className={styles.avatarWrapper}>
                    <Avatar
                      user={{
                        id: user._id,
                        name: user.name || 'Anonymous',
                        displayName: user.name || 'Anonymous',
                        avatarUrl: user.image,
                        status: isOnline ? 'online' : 'offline',
                      }}
                      size="md"
                    />
                  </div>
                  <div className={styles.memberInfo}>
                    <span className={styles.name}>{user.name}</span>
                    <span className={styles.email}>{user.email}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
}
