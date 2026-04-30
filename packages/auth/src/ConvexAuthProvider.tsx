'use client';

import { ReactNode, useMemo } from 'react';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';

interface ConvexAuthProviderProps {
  children: ReactNode;
  convexUrl: string;
  useAuth: any;
}

export function ConvexAuthProvider({ 
  children, 
  convexUrl, 
  useAuth 
}: ConvexAuthProviderProps) {
  const convex = useMemo(() => new ConvexReactClient(convexUrl), [convexUrl]);

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}
