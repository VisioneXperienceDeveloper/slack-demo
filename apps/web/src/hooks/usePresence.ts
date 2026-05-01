'use client';

import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";

const HEARTBEAT_INTERVAL = 30000; // 30 seconds

export const usePresence = () => {
  const updatePresence = useMutation(api.users.updatePresence);

  useEffect(() => {
    // Initial update
    updatePresence();

    const interval = setInterval(() => {
      updatePresence();
    }, HEARTBEAT_INTERVAL);

    return () => clearInterval(interval);
  }, [updatePresence]);
};
