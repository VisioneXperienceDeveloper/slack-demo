/**
 * MessageInput — Chat Feature Component
 *
 * Message composer with a text input, formatting
 * toolbar hint, and send button.
 */

'use client';

import { useState, useRef, useCallback, type KeyboardEvent } from 'react';
import styles from './MessageInput.module.css';

interface MessageInputProps {
  channelName: string;
  onSend: (content: string) => void;
  disabled?: boolean;
}

export default function MessageInput({ channelName, onSend, disabled = false }: MessageInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue('');
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [value, onSend]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const handleInput = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputContainer}>
        {/* Formatting toolbar */}
        <div className={styles.toolbar}>
          <button className={styles.toolbarBtn} title="Bold" type="button">
            <strong>B</strong>
          </button>
          <button className={styles.toolbarBtn} title="Italic" type="button">
            <em>I</em>
          </button>
          <button className={styles.toolbarBtn} title="Strikethrough" type="button">
            <s>S</s>
          </button>
          <span className={styles.toolbarDivider} />
          <button className={styles.toolbarBtn} title="Link" type="button">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M6 8L8 6M5 9L3.5 10.5C2.7 11.3 2.7 12.3 3.5 13C4.3 13.7 5.3 13.7 6 13L7.5 11.5M6.5 2.5L8 1C8.7 0.3 9.7 0.3 10.5 1C11.3 1.7 11.3 2.7 10.5 3.5L9 5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button className={styles.toolbarBtn} title="Code" type="button">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M4.5 4L1.5 7L4.5 10M9.5 4L12.5 7L9.5 10"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Text Input */}
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          placeholder={`Message #${channelName}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          disabled={disabled}
          rows={1}
        />

        {/* Bottom bar */}
        <div className={styles.bottomBar}>
          <div className={styles.attachments}>
            <button className={styles.attachBtn} title="Attach file" type="button">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 3V11C8 12.1 7.1 13 6 13C4.9 13 4 12.1 4 11V4C4 2.3 5.3 1 7 1C8.7 1 10 2.3 10 4V11C10 13.2 8.2 15 6 15C3.8 15 2 13.2 2 11V4"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <button className={styles.attachBtn} title="Emoji" type="button">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="6" cy="7" r="0.8" fill="currentColor" />
                <circle cx="10" cy="7" r="0.8" fill="currentColor" />
                <path
                  d="M5.5 10C6 11 6.8 11.5 8 11.5C9.2 11.5 10 11 10.5 10"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <button className={styles.attachBtn} title="Mention" type="button">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.2" />
                <path
                  d="M11 6V9.5C11 10.3 11.7 11 12.5 11C13.3 11 14 10.3 14 9.5V8C14 4.7 11.3 2 8 2C4.7 2 2 4.7 2 8C2 11.3 4.7 14 8 14C9.3 14 10.5 13.6 11.5 12.8"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <button
            className={`${styles.sendBtn} ${value.trim() ? styles.sendActive : ''}`}
            onClick={handleSend}
            disabled={!value.trim() || disabled}
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M14 2L7 9M14 2L10 14L7 9M14 2L2 6L7 9"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <p className={styles.hint}>
        <kbd className={styles.kbd}>Enter</kbd> to send · <kbd className={styles.kbd}>Shift + Enter</kbd> for new line
      </p>
    </div>
  );
}
