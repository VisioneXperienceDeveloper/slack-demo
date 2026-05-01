'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import { useRouter } from 'next/navigation';
import Modal from '@/shared/components/Modal';
import styles from './ChannelSettingsModal.module.css';

interface ChannelSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  channel: {
    id: string;
    name: string;
    description?: string;
  };
}

export default function ChannelSettingsModal({ isOpen, onClose, channel }: ChannelSettingsModalProps) {
  const router = useRouter();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [name, setName] = useState(channel.name);
  const [description, setDescription] = useState(channel.description || '');
  const [isLoading, setIsLoading] = useState(false);

  const updateChannel = useMutation(api.channels.update);
  const removeChannel = useMutation(api.channels.remove);

  const handleUpdateName = async () => {
    if (!name.trim() || name === channel.name) {
      setIsEditingName(false);
      return;
    }
    setIsLoading(true);
    try {
      await updateChannel({ id: channel.id as Id<"channels">, name: name.trim() });
      setIsEditingName(false);
    } catch (error) {
      console.error('Failed to update channel name:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateDescription = async () => {
    if (description === channel.description) {
      setIsEditingDescription(false);
      return;
    }
    setIsLoading(true);
    try {
      await updateChannel({ id: channel.id as Id<"channels">, description: description.trim() });
      setIsEditingDescription(false);
    } catch (error) {
      console.error('Failed to update channel description:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (channel.name === 'general') {
      alert('You cannot delete the general channel.');
      return;
    }

    const ok = window.confirm(`Are you sure you want to delete #${channel.name}? This will delete all messages in this channel.`);
    if (!ok) return;

    setIsLoading(true);
    try {
      await removeChannel({ id: channel.id as Id<"channels"> });
      onClose();
      // Redirect to home or another channel if possible. 
      // For simplicity, let the parent handle the redirect if needed or just go home.
      router.push('/');
    } catch (error) {
      console.error('Failed to delete channel:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`About #${channel.name}`}
    >
      <div className={styles.container}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Channel name</h3>
            {!isEditingName && <button className={styles.editBtn} onClick={() => setIsEditingName(true)}>Edit</button>}
          </div>
          {isEditingName ? (
            <div className={styles.editForm}>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className={styles.editInput}
                autoFocus
              />
              <div className={styles.editActions}>
                <button className={styles.cancelBtn} onClick={() => { setName(channel.name); setIsEditingName(false); }}>Cancel</button>
                <button className={styles.saveBtn} onClick={handleUpdateName} disabled={isLoading}>Save</button>
              </div>
            </div>
          ) : (
            <p className={styles.value}>#{channel.name}</p>
          )}
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Description</h3>
            {!isEditingDescription && <button className={styles.editBtn} onClick={() => setIsEditingDescription(true)}>Edit</button>}
          </div>
          {isEditingDescription ? (
            <div className={styles.editForm}>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className={styles.editTextarea}
                autoFocus
              />
              <div className={styles.editActions}>
                <button className={styles.cancelBtn} onClick={() => { setDescription(channel.description || ''); setIsEditingDescription(false); }}>Cancel</button>
                <button className={styles.saveBtn} onClick={handleUpdateDescription} disabled={isLoading}>Save</button>
              </div>
            </div>
          ) : (
            <p className={styles.value}>{channel.description || 'No description set.'}</p>
          )}
        </div>

        <div className={styles.section}>
          {channel.name !== 'general' ? (
            <button className={styles.deleteBtn} onClick={handleDelete} disabled={isLoading}>
              Delete channel
            </button>
          ) : (
            <p className={styles.hint}>The #general channel cannot be deleted.</p>
          )}
        </div>
      </div>
    </Modal>
  );
}
