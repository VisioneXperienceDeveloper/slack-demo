'use client';

import { useEffect, useRef } from 'react';
import styles from './MessageActionsMenu.module.css';

interface MessageActionsMenuProps {
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onCopyLink?: () => void;
  position: { top: number; left: number };
  isOwner: boolean;
}

export default function MessageActionsMenu({ 
  onClose, 
  onEdit, 
  onDelete, 
  onCopyLink,
  position,
  isOwner 
}: MessageActionsMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div 
      className={styles.menu} 
      ref={menuRef}
      style={{ top: position.top, left: position.left }}
    >
      <button className={styles.item} onClick={onCopyLink}>
        <span>Copy link</span>
      </button>
      
      {isOwner && (
        <>
          <div className={styles.divider} />
          <button className={styles.item} onClick={onEdit}>
            <span>Edit message</span>
          </button>
          <button className={`${styles.item} ${styles.danger}`} onClick={onDelete}>
            <span>Delete message</span>
          </button>
        </>
      )}
    </div>
  );
}
