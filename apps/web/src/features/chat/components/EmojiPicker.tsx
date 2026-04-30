'use client';

import { useEffect, useRef } from 'react';
import styles from './EmojiPicker.module.css';

const QUICK_EMOJIS = ['👍', '❤️', '😂', '🎉', '🤔', '👀'];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
  position?: { top: number; left: number };
}

export default function EmojiPicker({ onSelect, onClose, position }: EmojiPickerProps) {
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div 
      className={styles.picker} 
      ref={pickerRef}
      style={position ? { top: position.top, left: position.left, position: 'fixed' } : undefined}
    >
      <div className={styles.grid}>
        {QUICK_EMOJIS.map(emoji => (
          <button
            key={emoji}
            className={styles.emojiBtn}
            onClick={() => onSelect(emoji)}
            type="button"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
