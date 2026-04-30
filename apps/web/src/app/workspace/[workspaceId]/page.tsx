'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { chatService } from '@/features/chat';

export default function WorkspaceRedirectPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const router = useRouter();
  const [error, setError] = useState(false);
  const resolvedParams = use(params);

  useEffect(() => {
    async function redirect() {
      try {
        const channels = await chatService.getChannels(resolvedParams.workspaceId);
        if (channels.length > 0) {
          const generalChannel = channels.find(c => c.name === 'general') || channels[0];
          router.replace(`/workspace/${resolvedParams.workspaceId}/channel/${generalChannel.id}`);
        } else {
          // No channels exist, but we should theoretically have a general channel created
          setError(true);
        }
      } catch (e) {
        console.error(e);
        setError(true);
      }
    }
    
    redirect();
  }, [resolvedParams.workspaceId, router]);

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
