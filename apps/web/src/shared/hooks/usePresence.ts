'use client';

import { useEffect } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';

export function usePresence() {
  const updatePresence = useMutation(api.users.updatePresence);

  useEffect(() => {
    const HEARTBEAT_INTERVAL = 30000; // 30 seconds
    
    const update = async () => {
      try {
        await updatePresence();
      } catch (error) {
        console.error("Failed to update presence:", error);
      }
    };

    // Initial update
    update();

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        update();
      }
    }, HEARTBEAT_INTERVAL);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        update();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [updatePresence]);
}
