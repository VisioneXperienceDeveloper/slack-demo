'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useRouter } from 'next/navigation';
import type { Id } from '@convex/_generated/dataModel';
import Modal from '@/shared/components/Modal';
import Avatar from '@/shared/components/Avatar';
import styles from './MembersModal.module.css'; // Reusing member list styles

interface CreateDMModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
}

export default function CreateDMModal({ isOpen, onClose, workspaceId }: CreateDMModalProps) {
  const router = useRouter();
  const users = useQuery(api.users.list, { workspaceId: workspaceId as Id<"workspaces"> });
  const currentUser = useQuery(api.users.viewer);
  const getOrCreateConversation = useMutation(api.conversations.createOrGet);
  
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users?.filter(user => 
    user._id !== currentUser?._id && 
    (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleStartDM = async (otherUserId: Id<"users">) => {
    try {
      const channelId = await getOrCreateConversation({
        workspaceId: workspaceId as Id<"workspaces">,
        otherUserId,
      });
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
      onClose();
    } catch (error) {
      console.error('Failed to start DM:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New direct message">
      <div className={styles.container}>
        <div className={styles.searchBox}>
          <input 
            type="text" 
            placeholder="Type a name or email" 
            className={styles.searchInput} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>
        <div className={styles.list}>
          {users === undefined ? (
            <div className={styles.loading}>Loading members...</div>
          ) : filteredUsers?.length === 0 ? (
            <div className={styles.empty}>No members found.</div>
          ) : (
            filteredUsers?.map((user) => (
              <button 
                key={user._id} 
                className={styles.memberItem}
                style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                onClick={() => handleStartDM(user._id)}
              >
                <div className={styles.avatarWrapper}>
                  <Avatar
                    user={{
                      id: user._id,
                      name: user.name || 'Anonymous',
                      displayName: user.name || 'Anonymous',
                      avatarUrl: user.image,
                      status: 'offline', // Simplified
                    }}
                    size="md"
                  />
                </div>
                <div className={styles.memberInfo}>
                  <span className={styles.name}>{user.name}</span>
                  <span className={styles.email}>{user.email}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}
