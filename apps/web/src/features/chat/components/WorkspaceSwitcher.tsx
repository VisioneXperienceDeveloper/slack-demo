"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import CreateWorkspaceModal from "./CreateWorkspaceModal";
import styles from "./WorkspaceSwitcher.module.css";

export default function WorkspaceSwitcher() {
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const workspaces = useQuery(api.workspaces.list);

  return (
    <div className={styles.container}>
      {workspaces?.map((ws) => (
        <button
          key={ws._id}
          className={`${styles.workspaceBtn} ${ws._id === workspaceId ? styles.active : ''}`}
          onClick={() => router.push(`/workspace/${ws._id}`)}
          title={ws.name}
        >
          {ws.name.substring(0, 1).toUpperCase()}
        </button>
      ))}
      
      <button className={styles.addBtn} title="Create Workspace" onClick={() => setIsModalOpen(true)}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 5V15M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <CreateWorkspaceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
