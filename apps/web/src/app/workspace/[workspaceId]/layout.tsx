import { ReactNode } from 'react';
import { SidebarContainer } from '@/features/chat';
import { redirect } from 'next/navigation';

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ workspaceId: string }>;
}) {
  const resolvedParams = await params;
  
  // Catch old mock IDs like "ws-1" or other invalid Convex IDs and redirect
  if (resolvedParams.workspaceId.length < 10) {
    redirect('/');
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <SidebarContainer workspaceId={resolvedParams.workspaceId} />
      <main style={{ flex: 1, position: 'relative', minWidth: 0 }}>
        {children}
      </main>
    </div>
  );
}
