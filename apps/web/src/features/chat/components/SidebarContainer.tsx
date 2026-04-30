'use client';

import { useParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '../../../../../../convex/_generated/api';
import Sidebar from './Sidebar';
import type { Id } from '../../../../../../convex/_generated/dataModel';

interface SidebarContainerProps {
  workspaceId: string;
}

export default function SidebarContainer({ workspaceId }: SidebarContainerProps) {
  const workspace = useQuery(api.workspaces.get, { workspaceId: workspaceId as Id<"workspaces"> });
  const currentUser = useQuery(api.users.viewer);
  const channels = useQuery(api.channels.list, { workspaceId: workspaceId as Id<"workspaces"> });
  
  const params = useParams();
  const currentChannelId = params.channelId as string;

  if (workspace === undefined || currentUser === undefined || channels === undefined) {
    return (
      <aside style={{ width: 'var(--sidebar-width)', backgroundColor: 'var(--bg-secondary)', borderRight: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-spinner" />
      </aside>
    );
  }

  if (!currentUser || !workspace) {
    return (
      <aside style={{ width: 'var(--sidebar-width)', backgroundColor: 'var(--bg-secondary)', borderRight: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
        Workspace not found
      </aside>
    );
  }

  // Map Convex data to Domain Models
  const mappedWorkspace = {
    id: workspace._id,
    name: workspace.name,
    ownerId: workspace.ownerId,
    joinCode: workspace.joinCode,
    createdAt: new Date(workspace.createdAt),
  };

  const mappedCurrentUser = {
    id: currentUser._id,
    name: currentUser.name || 'Anonymous',
    displayName: currentUser.name || 'Anonymous',
    avatarUrl: currentUser.image,
    status: 'online' as const,
  };

  const mappedChannels = (channels || []).map(ch => ({
    id: ch._id,
    workspaceId: ch.workspaceId,
    name: ch.name,
    description: ch.description,
    isPrivate: ch.isPrivate,
    memberCount: 0, // Not available in basic table yet
    createdAt: new Date(ch.createdAt),
  }));

  const currentChannel = mappedChannels.find(c => c.id === currentChannelId) || null;

  return (
    <Sidebar
      workspace={mappedWorkspace}
      channels={mappedChannels}
      currentChannel={currentChannel}
      currentUser={mappedCurrentUser}
    />
  );
}
