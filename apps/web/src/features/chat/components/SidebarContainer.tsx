'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { chatService } from '../services/mock-chat.service';
import Sidebar from './Sidebar';
import type { Channel, User, Workspace } from '../domain/models';

interface SidebarContainerProps {
  workspaceId: string;
}

export default function SidebarContainer({ workspaceId }: SidebarContainerProps) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const params = useParams();
  const currentChannelId = params.channelId as string;

  useEffect(() => {
    async function init() {
      const [ws, user, chs] = await Promise.all([
        chatService.getWorkspace(workspaceId),
        chatService.getCurrentUser(),
        chatService.getChannels(workspaceId),
      ]);
      setWorkspace(ws);
      setCurrentUser(user);
      setChannels(chs);
    }
    init();
  }, [workspaceId]);

  if (!currentUser || !workspace) {
    return (
      <aside style={{ width: 'var(--sidebar-width)', backgroundColor: 'var(--bg-secondary)', borderRight: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-spinner" />
      </aside>
    );
  }

  const currentChannel = channels.find(c => c.id === currentChannelId) || null;

  return (
    <Sidebar
      workspace={workspace}
      channels={channels}
      currentChannel={currentChannel}
      currentUser={currentUser}
    />
  );
}
