'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { api } from '@convex/_generated/api';
import Modal from '@/shared/components/Modal';
import styles from './CreateWorkspaceModal.module.css';

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateWorkspaceModal({ isOpen, onClose }: CreateWorkspaceModalProps) {
  const [name, setName] = useState('');
  const [isPending, setIsPending] = useState(false);
  const createWorkspace = useMutation(api.workspaces.create);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isPending) return;

    setIsPending(true);
    try {
      const workspaceId = await createWorkspace({ name });
      router.push(`/workspace/${workspaceId}`);
      onClose();
      setName('');
    } catch (error) {
      console.error('Failed to create workspace:', error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create a workspace"
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="ws-name" className={styles.label}>Workspace name</label>
          <input
            id="ws-name"
            type="text"
            className={styles.input}
            placeholder="Ex: Team Projects, Personal, etc."
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
            autoFocus
            required
          />
          <p className={styles.hint}>This is the name of your new workspace.</p>
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={!name.trim() || isPending}
          >
            {isPending ? 'Creating...' : 'Create Workspace'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
