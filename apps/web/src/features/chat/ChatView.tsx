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
import Sidebar from './components/Sidebar';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import styles from './ChatView.module.css';

export default function ChatView() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ─── Initial Data Load ────────────────────────────────

  useEffect(() => {
    async function init() {
      setIsLoading(true);
      try {
        const [channelList, user] = await Promise.all([
          chatService.getChannels(),
          chatService.getCurrentUser(),
        ]);
        setChannels(channelList);
        setCurrentUser(user);

        // Auto-select first channel
        if (channelList.length > 0) {
          setCurrentChannel(channelList[0]);
          const msgs = await chatService.getMessages(channelList[0].id);
          setMessages(msgs);
        }
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, []);

  // ─── Channel Selection ────────────────────────────────

  const handleChannelSelect = useCallback(async (channel: Channel) => {
    setCurrentChannel(channel);
    setIsLoading(true);
    try {
      const msgs = await chatService.getMessages(channel.id);
      setMessages(msgs);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ─── Send Message ─────────────────────────────────────

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!currentChannel || !currentUser) return;

      const newMessage = await chatService.sendMessage(
        currentChannel.id,
        content,
        currentUser,
      );
      setMessages((prev) => [...prev, newMessage]);
    },
    [currentChannel, currentUser],
  );

  // ─── Render ───────────────────────────────────────────

  if (!currentUser) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingSpinner} />
        <p className={styles.loadingText}>Loading workspace...</p>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <Sidebar
        channels={channels}
        currentChannel={currentChannel}
        currentUser={currentUser}
        onChannelSelect={handleChannelSelect}
      />
      <main className={styles.main}>
        <ChatHeader channel={currentChannel} />
        <MessageList messages={messages} isLoading={isLoading} />
        {currentChannel && (
          <MessageInput
            channelName={currentChannel.name}
            onSend={handleSendMessage}
          />
        )}
      </main>
    </div>
  );
}
