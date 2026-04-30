/**
 * Chat Service Interface (Port)
 *
 * Defines the contract for chat operations.
 * Implementations (adapters) can be swapped between
 * mock data, REST API, WebSocket, etc.
 */

import type { Channel, Message, User, Workspace } from '../domain/models';

export interface ChatService {
  /** Get all workspaces for the current user */
  getWorkspaces(): Promise<Workspace[]>;

  /** Get a single workspace by ID */
  getWorkspace(workspaceId: string): Promise<Workspace | null>;

  /** Create a new workspace */
  createWorkspace(name: string, owner: User): Promise<Workspace>;

  /** Get all available channels in a workspace */
  getChannels(workspaceId: string): Promise<Channel[]>;

  /** Get a single channel by ID */
  getChannel(channelId: string): Promise<Channel | null>;

  /** Get messages for a channel */
  getMessages(channelId: string): Promise<Message[]>;

  /** Send a new message to a channel */
  sendMessage(workspaceId: string, channelId: string, content: string, author: User): Promise<Message>;

  /** Get all users */
  getUsers(): Promise<User[]>;

  /** Get the current (logged-in) user */
  getCurrentUser(): Promise<User>;
}
