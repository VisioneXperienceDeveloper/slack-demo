'use client';

import { useState, useRef, useCallback, useMemo, type KeyboardEvent } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useParams } from 'next/navigation';
import type { Id } from '@convex/_generated/dataModel';
import EmojiPicker from './EmojiPicker';
import styles from './MessageInput.module.css';

interface MessageInputProps {
  channelName: string;
  onSend: (content: string, image?: File) => void;
  disabled?: boolean;
  initialValue?: string;
  isEditing?: boolean;
  onCancelEdit?: () => void;
}

export default function MessageInput({ 
  channelName, 
  onSend, 
  disabled = false,
  initialValue = '',
  isEditing = false,
  onCancelEdit
}: MessageInputProps) {
  const [value, setValue] = useState(initialValue);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiPickerPosition, setEmojiPickerPosition] = useState<{ top: number; left: number } | null>(null);
  const emojiBtnRef = useRef<HTMLButtonElement>(null);

  const handleEmojiButtonClick = () => {
    if (showEmojiPicker) {
      setShowEmojiPicker(false);
    } else {
      const rect = emojiBtnRef.current?.getBoundingClientRect();
      if (rect) {
        setEmojiPickerPosition({
          top: rect.top - 410,
          left: rect.left - 10,
        });
        setShowEmojiPicker(true);
      }
    }
  };
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Mentions state
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const users = useQuery(api.users.list, { workspaceId: workspaceId as Id<"workspaces"> });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredUsers = useMemo(() => {
    if (mentionQuery === null || !users) return [];
    return users.filter(user => 
      user.name?.toLowerCase().includes(mentionQuery.toLowerCase())
    ).slice(0, 5);
  }, [mentionQuery, users]);

  const handleSend = useCallback(() => {
    if (!value.trim() && !selectedImage) return;
    
    onSend(value.trimEnd(), selectedImage || undefined);
    
    setValue('');
    setSelectedImage(null);
    setImagePreview(null);
    setMentionQuery(null);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [value, selectedImage, onSend]);

  const insertMention = useCallback((user: { name?: string }) => {
    if (mentionQuery === null) return;
    
    const userName = user.name || 'Anonymous';
    const before = value.substring(0, cursorPos - mentionQuery.length - 1);
    const after = value.substring(cursorPos);
    const newValue = `${before}@${userName} ${after}`;
    
    setValue(newValue);
    setMentionQuery(null);
    
    // Set focus back and adjust height
    setTimeout(() => {
      textareaRef.current?.focus();
      if (textareaRef.current) {
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = before.length + userName.length + 2;
      }
    }, 0);
  }, [value, mentionQuery, cursorPos]);

  const handleFormat = useCallback((prefix: string, suffix: string = prefix) => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.substring(start, end);
    const newValue = value.substring(0, start) + prefix + selected + suffix + value.substring(end);
    
    setValue(newValue);
    
    // Reset selection
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  }, [value]);

  const handleEmojiSelect = (emoji: string) => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const newValue = value.substring(0, start) + emoji + value.substring(end);
    
    setValue(newValue);
    setShowEmojiPicker(false);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (mentionQuery !== null && filteredUsers.length > 0) {
        // ... (existing mention logic)
      }

      if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
        e.preventDefault();
        handleSend();
      }

      if (e.key === 'Escape' && isEditing) {
        e.preventDefault();
        onCancelEdit?.();
      }
    },
    [handleSend, mentionQuery, filteredUsers, isEditing, onCancelEdit],
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const position = e.target.selectionStart;
    setValue(newValue);
    setCursorPos(position);

    // Detect mention start
    const lastAtPos = newValue.lastIndexOf('@', position - 1);
    if (lastAtPos !== -1) {
      const queryPart = newValue.substring(lastAtPos + 1, position);
      // Ensure no spaces between @ and cursor
      if (!queryPart.includes(' ')) {
        setMentionQuery(queryPart);
        setSelectedIndex(0);
      } else {
        setMentionQuery(null);
      }
    } else {
      setMentionQuery(null);
    }
  };

  const handleInput = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const removeImage = useCallback(() => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputContainer}>
        {/* Mention Suggestions */}
        {mentionQuery !== null && filteredUsers.length > 0 && (
          <div className={styles.mentionSuggestions}>
            {filteredUsers.map((user, i) => (
              <button
                key={user._id}
                className={`${styles.suggestionItem} ${i === selectedIndex ? styles.activeSuggestion : ''}`}
                onClick={() => insertMention(user)}
              >
                <img src={user.image} alt="" className={styles.suggestionAvatar} />
                <span className={styles.suggestionName}>{user.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Image Preview */}
        {imagePreview && (
          <div className={styles.previewContainer}>
            <div className={styles.previewItem}>
              <img src={imagePreview} alt="Upload preview" />
              <button className={styles.removePreview} onClick={removeImage} title="Remove image">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Formatting toolbar */}
        <div className={styles.toolbar}>
          <button className={styles.toolbarBtn} title="Bold" type="button" onClick={() => handleFormat('**')}><strong>B</strong></button>
          <button className={styles.toolbarBtn} title="Italic" type="button" onClick={() => handleFormat('_')}><em>I</em></button>
          <button className={styles.toolbarBtn} title="Strikethrough" type="button" onClick={() => handleFormat('~')}><s>S</s></button>
          <span className={styles.toolbarDivider} />
          <button className={styles.toolbarBtn} title="Link" type="button" onClick={() => handleFormat('[', '](url)')}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M6 8L8 6M5 9L3.5 10.5C2.7 11.3 2.7 12.3 3.5 13C4.3 13.7 5.3 13.7 6 13L7.5 11.5M6.5 2.5L8 1C8.7 0.3 9.7 0.3 10.5 1C11.3 1.7 11.3 2.7 10.5 3.5L9 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
          <button className={styles.toolbarBtn} title="Code" type="button" onClick={() => handleFormat('`')}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M4.5 4L1.5 7L4.5 10M9.5 4L12.5 7L9.5 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Text Input */}
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          placeholder={isEditing ? "Edit message..." : `Message #${channelName}`}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          disabled={disabled}
          rows={1}
        />

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {/* Bottom bar */}
        <div className={styles.bottomBar}>
          <div className={styles.attachments}>
            <button 
              className={styles.attachBtn} 
              title="Attach file" 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isEditing}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3V11C8 12.1 7.1 13 6 13C4.9 13 4 12.1 4 11V4C4 2.3 5.3 1 7 1C8.7 1 10 2.3 10 4V11C10 13.2 8.2 15 6 15C3.8 15 2 13.2 2 11V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
            <button 
              className={styles.attachBtn} 
              title="Emoji" 
              type="button"
              onClick={handleEmojiButtonClick}
              ref={emojiBtnRef}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="6" cy="7" r="0.8" fill="currentColor" />
                <circle cx="10" cy="7" r="0.8" fill="currentColor" />
                <path d="M5.5 10C6 11 6.8 11.5 8 11.5C9.2 11.5 10 11 10.5 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
            <button className={styles.attachBtn} title="Mention" type="button" onClick={() => {
              setValue(v => v + '@');
              setMentionQuery('');
              textareaRef.current?.focus();
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.2" />
                <path d="M11 6V9.5C11 10.3 11.7 11 12.5 11C13.3 11 14 10.3 14 9.5V8C14 4.7 11.3 2 8 2C4.7 2 2 4.7 2 8C2 11.3 4.7 14 8 14C9.3 14 10.5 13.6 11.5 12.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className={styles.actions}>
            {isEditing && (
              <button 
                className={styles.cancelBtn} 
                onClick={onCancelEdit}
                type="button"
              >
                Cancel
              </button>
            )}
            <button
              className={`${styles.sendBtn} ${(value.trim() || selectedImage) ? styles.sendActive : ''}`}
              onClick={handleSend}
              disabled={(!value.trim() && !selectedImage) || disabled}
              type="button"
            >
              {isEditing ? (
                <span className={styles.saveLabel}>Save</span>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M14 2L7 9M14 2L10 14L7 9M14 2L2 6L7 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {showEmojiPicker && emojiPickerPosition && (
        <EmojiPicker 
          onSelect={handleEmojiSelect}
          onClose={() => setShowEmojiPicker(false)}
          position={emojiPickerPosition}
        />
      )}

      <p className={styles.hint}>
        <kbd className={styles.kbd}>Enter</kbd> to send · <kbd className={styles.kbd}>Shift + Enter</kbd> for new line
      </p>
    </div>
  );
}
