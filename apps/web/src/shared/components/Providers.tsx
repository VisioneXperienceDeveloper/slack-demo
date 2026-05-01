'use client';

import { ReactNode } from 'react';
import { ClerkProvider, useAuth } from '@clerk/nextjs';
import { ConvexAuthProvider } from '@slack-clone/auth';
import { dark } from '@clerk/themes';

import { useAuthUser } from '../hooks/use-auth-user';
import { usePresence } from '../../hooks/usePresence';
import { SidebarProvider } from '../contexts/SidebarContext';

function UserSync({ children }: { children: ReactNode }) {
  useAuthUser();
  usePresence();
  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#FFFFFF',
          colorBackground: '#0A0A0A',
          colorInputBackground: '#141414',
          colorInputText: '#EBEBEB',
          colorText: '#EBEBEB',
          borderRadius: '6px',
        },
        elements: {
          card: 'bg-[#0A0A0A] border border-[#1F1F1F] shadow-xl',
          socialButtonsBlockButton: 'border-[#2A2A2A] hover:bg-[#1E1E1E] transition-all',
          socialButtonsBlockButtonText: 'font-medium',
          formButtonPrimary: 'bg-white text-black hover:bg-[#E0E0E0] transition-all',
          footerActionLink: 'text-white hover:text-[#E0E0E0]',
        }
      }}
    >
      <ConvexAuthProvider 
        convexUrl={process.env.NEXT_PUBLIC_CONVEX_URL!} 
        useAuth={useAuth}
      >
        <SidebarProvider>
          <UserSync>
            {children}
          </UserSync>
        </SidebarProvider>
      </ConvexAuthProvider>
    </ClerkProvider>
  );
}
