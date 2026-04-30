/**
 * Chat Service Interface (Port)
 *
 * Defines the contract for chat operations.
 * Implementations (adapters) can be swapped between
 * mock data, REST API, WebSocket, etc.
 */

import type { Channel, Message, User } from '../domain/models';

export interface ChatService {
  /** Get all available channels */
  getChannels(): Promise<Channel[]>;

  /** Get a single channel by ID */
  getChannel(channelId: string): Promise<Channel | null>;

  /** Get messages for a channel */
  getMessages(channelId: string): Promise<Message[]>;

  /** Send a new message to a channel */
  sendMessage(channelId: string, content: string, author: User): Promise<Message>;

  /** Get all users */
  getUsers(): Promise<User[]>;

  /** Get the current (logged-in) user */
  getCurrentUser(): Promise<User>;
}
