'use client';

import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import styles from "./MessageBubble.module.css";

interface MessageImageProps {
  storageId: string;
}

export default function MessageImage({ storageId }: MessageImageProps) {
  const url = useQuery(api.messages.getUrl, { storageId: storageId as Id<"_storage"> });

  if (!url) {
    return (
      <div className={styles.imagePlaceholder}>
        <div className={styles.skeleton} style={{ width: '100%', height: '200px', borderRadius: '8px' }} />
      </div>
    );
  }

  return (
    <div className={styles.imageContainer}>
      <img 
        src={url} 
        alt="Uploaded content" 
        className={styles.messageImage} 
        loading="lazy"
        onClick={() => window.open(url, "_blank")}
      />
    </div>
  );
}
