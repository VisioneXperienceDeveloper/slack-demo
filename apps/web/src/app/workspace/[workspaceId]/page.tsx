'use client';

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';

export default function WorkspaceRedirectPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  
  // Conditionally skip query if the ID is obviously not a Convex ID (like the old "ws-1")
  const isValidId = resolvedParams.workspaceId.length > 10;
  const channels = useQuery(api.channels.list, isValidId ? { workspaceId: resolvedParams.workspaceId as Id<"workspaces"> } : "skip");

  useEffect(() => {
    if (channels && channels.length > 0) {
      const generalChannel = channels.find(c => c.name === 'general') || channels[0];
      router.replace(`/workspace/${resolvedParams.workspaceId}/channel/${generalChannel._id}`);
    }
  }, [channels, resolvedParams.workspaceId, router]);

  if (channels && channels.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
        No channels found for this workspace.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <div className="loading-spinner" style={{ width: '24px', height: '24px', border: '2px solid var(--border-default)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  );
}
