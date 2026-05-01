'use client';

import { ReactNode, use } from 'react';
import { SidebarContainer } from '@/features/chat';
import WorkspaceSwitcher from '@/features/chat/components/WorkspaceSwitcher';
import GlobalHeader from '@/shared/components/GlobalHeader';
import { useSidebar } from '@/shared/contexts/SidebarContext';
import { usePresence } from '@/shared/hooks/usePresence';
import styles from './layout.module.css';

export default function WorkspaceLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ workspaceId: string }>;
}) {
  const resolvedParams = use(params);
  const { isOpen, toggle } = useSidebar();
  
  usePresence();


  return (
    <div className={`${styles.layout} ${isOpen ? styles.sidebarOpen : ''}`}>
      <GlobalHeader />
      <div className={styles.mainContainer}>
        <div className={styles.switcherWrapper}>
          <WorkspaceSwitcher />
        </div>
        <div className={styles.sidebarWrapper}>
          <SidebarContainer workspaceId={resolvedParams.workspaceId} />
        </div>
        <main className={styles.content}>
          {children}
        </main>
        <div className={styles.overlay} onClick={() => toggle()} />
      </div>
    </div>
  );
}
