import { ReactNode } from 'react';
import { SidebarContainer } from '@/features/chat';

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ workspaceId: string }>;
}) {
  const resolvedParams = await params;
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <SidebarContainer workspaceId={resolvedParams.workspaceId} />
      <main style={{ flex: 1, position: 'relative', minWidth: 0 }}>
        {children}
      </main>
    </div>
  );
}
