'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { chatService } from '@/features/chat';
import styles from './WorkspaceOnboarding.module.css';

export function WorkspaceOnboarding() {
  const [name, setName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName || isCreating) return;

    setIsCreating(true);
    try {
      const currentUser = await chatService.getCurrentUser();
      const workspace = await chatService.createWorkspace(trimmedName, currentUser);
      const channels = await chatService.getChannels(workspace.id);
      const generalChannel = channels.find(c => c.name === 'general') || channels[0];
      
      router.push(`/workspace/${workspace.id}/channel/${generalChannel.id}`);
    } catch (error) {
      console.error('Failed to create workspace:', error);
      setIsCreating(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconContainer}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        </div>
        <h1 className={styles.title}>Create a workspace</h1>
        <p className={styles.subtitle}>
          Your workspace is where you and your team will collaborate.
        </p>
        
        <form onSubmit={handleCreate} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="workspace-name" className={styles.label}>
              Workspace name
            </label>
            <input
              id="workspace-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Acme Corp or My Project"
              className={styles.input}
              autoFocus
              maxLength={50}
              disabled={isCreating}
            />
          </div>
          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={!name.trim() || isCreating}
          >
            {isCreating ? 'Creating...' : 'Create Workspace'}
          </button>
        </form>
      </div>
    </div>
  );
}
