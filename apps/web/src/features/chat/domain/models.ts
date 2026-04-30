/**
 * Chat Domain Models
 *
 * Core domain entities for the chat feature.
 * These models are infrastructure-agnostic and represent
 * the business logic of the chat system.
 */

export interface User {
  id: string;
  name: string;
  displayName: string;
  avatarUrl?: string;
  status: 'online' | 'offline' | 'away' | 'dnd';
}

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  joinCode: string;
  createdAt: Date;
}

export interface Channel {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  memberCount: number;
  createdAt: Date;
}

export interface Message {
  id: string;
  channelId: string;
  workspaceId: string;
  author: User;
  content: string;
  timestamp: Date;
  isEdited: boolean;
  reactions: Reaction[];
  threadCount?: number;
}

export interface Reaction {
  emoji: string;
  count: number;
  users: string[]; // user IDs
}

export interface ChatState {
  currentChannel: Channel | null;
  messages: Message[];
  channels: Channel[];
  users: User[];
  isLoading: boolean;
}
