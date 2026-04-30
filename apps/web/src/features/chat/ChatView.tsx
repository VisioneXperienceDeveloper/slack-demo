/**
 * ChatView — Chat Feature Container
 *
 * Main container that orchestrates the chat feature.
 * Manages state, service calls, and composes all
 * chat sub-components together.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Channel, Message, User } from './domain/models';
import { chatService } from './services/mock-chat.service';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import styles from './ChatView.module.css';

interface ChatViewProps {
  workspaceId: string;
  channelId: string;
}

export default function ChatView({ workspaceId, channelId }: ChatViewProps) {
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  // ─── Initial Data Load ────────────────────────────────

  useEffect(() => {
    async function init() {
      setIsLoading(true);
      try {
        const [channel, user, msgs] = await Promise.all([
          chatService.getChannel(channelId),
          chatService.getCurrentUser(),
          chatService.getMessages(channelId),
        ]);
        
        // Verify channel belongs to workspace
        if (channel && channel.workspaceId === workspaceId) {
          setCurrentChannel(channel);
          setCurrentUser(user);
          setMessages(msgs);
        }
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, [workspaceId, channelId]);

  // ─── Send Message ─────────────────────────────────────

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!currentChannel || !currentUser || isSending) return;

      setIsSending(true);
      try {
        const newMessage = await chatService.sendMessage(
          workspaceId,
          currentChannel.id,
          content,
          currentUser,
        );
        setMessages((prev) => [...prev, newMessage]);
      } finally {
        setIsSending(false);
      }
    },
    [workspaceId, currentChannel, currentUser, isSending],
  );

  // ─── Render ───────────────────────────────────────────

  if (!currentUser || !currentChannel) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingSpinner} />
        <p className={styles.loadingText}>Loading channel...</p>
      </div>
    );
  }

  return (
    <div className={styles.layout} style={{ gridTemplateColumns: '1fr' }}>
      <main className={styles.main}>
        <ChatHeader channel={currentChannel} />
        <MessageList messages={messages} isLoading={isLoading} />
        <MessageInput
          channelName={currentChannel.name}
          onSend={handleSendMessage}
          disabled={isSending}
        />
      </main>
    </div>
  );
}
