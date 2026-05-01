'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import Modal from '@/shared/components/Modal';
import styles from './CreateWorkspaceModal.module.css'; // Reusing styles

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
}

export default function CreateChannelModal({ isOpen, onClose, workspaceId }: CreateChannelModalProps) {
  const [name, setName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const createChannel = useMutation(api.channels.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isLoading) return;

    setIsLoading(true);
    try {
      await createChannel({
        name: name.trim().toLowerCase().replace(/\s+/g, '-'),
        workspaceId: workspaceId as Id<"workspaces">,
        isPrivate,
      });
      onClose();
      setName('');
      setIsPrivate(false);
    } catch (error) {
      console.error('Failed to create channel:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a channel">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. plan-budget"
            className={styles.input}
            autoFocus
            required
          />
          <p className={styles.hint}>Channels are where your team communicates. They’re best when organized around a topic — #marketing, for example.</p>
        </div>

        <div className={styles.inputGroup}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <label className={styles.label} style={{ marginBottom: 0 }}>Make private</label>
              <p className={styles.hint} style={{ marginTop: 4 }}>When a channel is set to private, it can only be viewed or joined by invitation.</p>
            </div>
            <input 
              type="checkbox" 
              checked={isPrivate} 
              onChange={(e) => setIsPrivate(e.target.checked)}
              style={{ width: 20, height: 20, accentColor: 'var(--accent)' }}
            />
          </div>
        </div>

        <div className={styles.footer}>
          <button 
            type="button" 
            onClick={onClose} 
            className={styles.cancelBtn}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={!name.trim() || isLoading}
          >
            {isLoading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
