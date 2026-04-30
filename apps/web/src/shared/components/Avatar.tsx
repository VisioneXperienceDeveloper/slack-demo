/**
 * Avatar — Shared Component
 *
 * Displays a user avatar with an optional status indicator.
 * Falls back to initials when no image is provided.
 */

import type { User } from '@/features/chat/domain/models';
import styles from './Avatar.module.css';

interface AvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const STATUS_COLORS: Record<User['status'], string> = {
  online: 'var(--status-online)',
  away: 'var(--status-away)',
  dnd: 'var(--status-dnd)',
  offline: 'var(--status-offline)',
};

export default function Avatar({ user, size = 'md', showStatus = false }: AvatarProps) {
  const initials = getInitials(user.displayName);

  return (
    <div className={`${styles.avatar} ${styles[size]}`}>
      <div className={styles.inner}>
        <span className={styles.initials}>{initials}</span>
      </div>
      {showStatus && (
        <span
          className={styles.status}
          style={{ backgroundColor: STATUS_COLORS[user.status] }}
          title={user.status}
        />
      )}
    </div>
  );
}
