'use client';

import { SignUp } from '@clerk/nextjs';


export default function SignUpPage() {
  return (
    <div className="auth-container">
      <div className="auth-content animate-slide-up">
        <div className="auth-header">
          <div className="auth-logo">SC</div>
          <h1>Create an account</h1>
          <p>Join the Slack Clone community today</p>
        </div>
        <SignUp />
      </div>

      <style jsx>{`
        .auth-content {
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          gap: var(--space-8);
        }
        .auth-header {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-2);
        }
        .auth-logo {
          width: 48px;
          height: 48px;
          background-color: var(--accent);
          color: var(--text-inverse);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-lg);
          font-weight: 800;
          font-size: var(--text-xl);
          margin-bottom: var(--space-4);
        }
        .auth-header h1 {
          font-size: var(--text-2xl);
          font-weight: 600;
          letter-spacing: -0.02em;
        }
        .auth-header p {
          color: var(--text-secondary);
          font-size: var(--text-sm);
        }
      `}</style>
    </div>
  );
}
