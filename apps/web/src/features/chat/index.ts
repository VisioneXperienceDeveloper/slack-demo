/**
 * Chat Feature — Barrel Export
 */

export { default as Sidebar } from './components/Sidebar';
export { default as SidebarContainer } from './components/SidebarContainer';
export { default as ChatHeader } from './components/ChatHeader';
export { default as MessageList } from './components/MessageList';
export { default as MessageInput } from './components/MessageInput';
export { default as MessageBubble } from './components/MessageBubble';

export type { ChatService } from './services/chat.service';
export { chatService } from './services/mock-chat.service';

export type { User, Channel, Message, Reaction, ChatState } from './domain/models';
