'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import Modal from '@/shared/components/Modal';
import Avatar from '@/shared/components/Avatar';
import styles from './MembersModal.module.css';

interface InviteChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  channelId: string;
}

export default function InviteChannelModal({ isOpen, onClose, workspaceId, channelId }: InviteChannelModalProps) {
  const users = useQuery(api.users.list, { workspaceId: workspaceId as Id<"workspaces"> });
  const channelMembers = useQuery(api.channels.getMembers, { channelId: channelId as Id<"channels"> });
  const invite = useMutation(api.channels.invite);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Map channel members for easy lookup
  const membersMap = new Map(channelMembers?.map(m => [m.userId, m.role]));

  const filteredUsers = users?.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInvite = async (userId: Id<"users">) => {
    setIsLoading(true);
    try {
      await invite({ channelId: channelId as Id<"channels">, userId });
    } catch (error) {
      console.error('Failed to invite user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add people">
      <div className={styles.container}>
        <div className={styles.searchBox}>
          <input 
            type="text" 
            placeholder="Search by name or email" 
            className={styles.searchInput} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>
        <div className={styles.list}>
          {users === undefined || channelMembers === undefined ? (
            <div className={styles.loading}>Loading members...</div>
          ) : filteredUsers?.length === 0 ? (
            <div className={styles.empty}>No members found.</div>
          ) : (
            filteredUsers?.map((user) => {
              const memberRole = membersMap.get(user._id);
              const isAlreadyInChannel = membersMap.has(user._id);

              return (
                <div key={user._id} className={styles.memberItem}>
                  <div className={styles.avatarWrapper}>
                    <Avatar
                      user={{
                        id: user._id,
                        name: user.name || 'Anonymous',
                        displayName: user.name || 'Anonymous',
                        avatarUrl: user.image,
                        status: 'offline',
                      }}
                      size="md"
                    />
                  </div>
                  <div className={styles.memberInfo}>
                    <span className={styles.name}>{user.name}</span>
                    <span className={styles.email}>{user.email}</span>
                  </div>
                  
                  {isAlreadyInChannel ? (
                    <span className={styles.roleBadge}>
                      {memberRole === "admin" ? "Owner" : "Participant"}
                    </span>
                  ) : (
                    <button 
                      className={styles.inviteBtn}
                      onClick={() => handleInvite(user._id)}
                      disabled={isLoading}
                    >
                      Add
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
}
