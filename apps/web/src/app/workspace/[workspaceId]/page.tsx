'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '../../../../../../convex/_generated/api';
import type { Id } from '../../../../../../convex/_generated/dataModel';

export default function WorkspaceRedirectPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const router = useRouter();
  const [error, setError] = useState(false);
  const resolvedParams = use(params);
  const channels = useQuery(api.channels.list, { workspaceId: resolvedParams.workspaceId as Id<"workspaces"> });

  useEffect(() => {
    if (channels === undefined) return;

    if (channels.length > 0) {
      const generalChannel = channels.find(c => c.name === 'general') || channels[0];
      router.replace(`/workspace/${resolvedParams.workspaceId}/channel/${generalChannel._id}`);
    } else {
      setError(true);
    }
  }, [channels, resolvedParams.workspaceId, router]);

  if (error) {
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
