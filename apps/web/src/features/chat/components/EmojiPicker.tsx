'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Theme } from 'emoji-picker-react';
import styles from './EmojiPicker.module.css';

// Dynamically import the picker to avoid SSR issues
const Picker = dynamic(
  () => import('emoji-picker-react'),
  { ssr: false }
);

const QUICK_EMOJIS = ['👍', '❤️', '😂', '🎉', '🤔', '👀'];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
  position?: { top: number; left: number };
}

export default function EmojiPicker({ onSelect, onClose, position }: EmojiPickerProps) {
  const pickerRef = useRef<HTMLDivElement>(null);
  const [showFull, setShowFull] = useState(false);

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
      <div className={styles.quickGrid}>
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
        <button 
          className={styles.moreBtn} 
          onClick={() => setShowFull(!showFull)}
          title="Full Picker"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {showFull && (
        <div className={styles.fullPickerContainer}>
          <Picker 
            theme={Theme.DARK}
            onEmojiClick={(emojiData) => onSelect(emojiData.emoji)}
            width={320}
            height={400}
            skinTonesDisabled
            searchPlaceHolder="Search emojis..."
          />
        </div>
      )}
    </div>
  );
}
