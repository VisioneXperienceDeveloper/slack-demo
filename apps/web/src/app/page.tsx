'use client';

import { UserButton, SignInButton } from '@clerk/nextjs';
import { Authenticated, Unauthenticated, AuthLoading } from 'convex/react';
import ChatView from '@/features/chat/ChatView';

export default function Home() {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-left">
          <h1 className="logo">Slack Clone</h1>
        </div>
        <div className="header-right">
          <AuthLoading>
            <div className="loading-spinner" />
          </AuthLoading>
          <Authenticated>
            <UserButton afterSignOutUrl="/" />
          </Authenticated>
          <Unauthenticated>
            <SignInButton mode="modal">
              <button className="btn-primary">Log In</button>
            </SignInButton>
          </Unauthenticated>
        </div>
      </header>

      <main className="app-main">
        <Authenticated>
          <ChatView />
        </Authenticated>
        
        <Unauthenticated>
          <div className="welcome-hero">
            <div className="hero-content">
              <h2>Connect with your team instantly</h2>
              <p>Minimal, fast, and secure communication for modern teams.</p>
              <SignInButton mode="modal">
                <button className="btn-large">Get Started</button>
              </SignInButton>
            </div>
          </div>
        </Unauthenticated>
      </main>

      <style jsx>{`
        .app-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          width: 100vw;
          background-color: var(--bg-primary);
        }
        .app-header {
          height: var(--header-height);
          border-bottom: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--space-4);
          background-color: var(--bg-secondary);
        }
        .logo {
          font-size: var(--text-md);
          font-weight: 600;
          color: var(--text-primary);
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }
        .app-main {
          flex: 1;
          overflow: hidden;
          position: relative;
        }
        .welcome-hero {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          background: radial-gradient(circle at top, var(--bg-secondary), var(--bg-primary));
        }
        .hero-content h2 {
          font-size: var(--text-2xl);
          margin-bottom: var(--space-2);
          color: var(--text-primary);
        }
        .hero-content p {
          color: var(--text-secondary);
          margin-bottom: var(--space-6);
        }
        .btn-primary {
          background-color: var(--accent);
          color: var(--text-inverse);
          padding: var(--space-1) var(--space-4);
          border-radius: var(--radius-md);
          font-weight: 500;
          font-size: var(--text-sm);
          transition: background-color var(--transition-fast);
        }
        .btn-primary:hover {
          background-color: var(--accent-hover);
        }
        .btn-large {
          background-color: var(--accent);
          color: var(--text-inverse);
          padding: var(--space-3) var(--space-8);
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: var(--text-md);
          transition: transform var(--transition-fast);
        }
        .btn-large:hover {
          transform: translateY(-2px);
        }
        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid var(--border-default);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
