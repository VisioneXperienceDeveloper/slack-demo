/**
 * Mock Chat Service (Adapter)
 *
 * Mock implementation of ChatService for development.
 * Provides realistic fake data that simulates a real
 * Slack-like chat experience.
 */

import type { Channel, Message, User } from '../domain/models';
import type { ChatService } from './chat.service';

// ─── Mock Users ──────────────────────────────────────────────

const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'jungwoo',
    displayName: 'Jungwoo Choi',
    status: 'online',
  },
  {
    id: 'user-2',
    name: 'sarah',
    displayName: 'Sarah Kim',
    status: 'online',
  },
  {
    id: 'user-3',
    name: 'alex',
    displayName: 'Alex Park',
    status: 'away',
  },
  {
    id: 'user-4',
    name: 'mina',
    displayName: 'Mina Lee',
    status: 'offline',
  },
  {
    id: 'user-5',
    name: 'david',
    displayName: 'David Jung',
    status: 'online',
  },
];

// ─── Mock Channels ───────────────────────────────────────────

const mockChannels: Channel[] = [
  {
    id: 'ch-general',
    name: 'general',
    description: 'Company-wide announcements and work-based matters',
    isPrivate: false,
    memberCount: 42,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'ch-engineering',
    name: 'engineering',
    description: 'Engineering team discussions',
    isPrivate: false,
    memberCount: 18,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'ch-design',
    name: 'design',
    description: 'Design team discussions and reviews',
    isPrivate: false,
    memberCount: 8,
    createdAt: new Date('2024-02-01'),
  },
  {
    id: 'ch-random',
    name: 'random',
    description: 'Non-work banter and water cooler conversation',
    isPrivate: false,
    memberCount: 38,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'ch-standup',
    name: 'daily-standup',
    description: 'Daily standup notes',
    isPrivate: false,
    memberCount: 15,
    createdAt: new Date('2024-03-01'),
  },
];

// ─── Mock Messages ───────────────────────────────────────────

const today = new Date();
const makeTime = (hoursAgo: number, minutesAgo: number = 0) => {
  const d = new Date(today);
  d.setHours(d.getHours() - hoursAgo, d.getMinutes() - minutesAgo);
  return d;
};

const mockMessages: Record<string, Message[]> = {
  'ch-general': [
    {
      id: 'msg-1',
      channelId: 'ch-general',
      author: mockUsers[1],
      content: 'Good morning everyone! 👋 Just pushed the latest design system updates to the staging environment.',
      timestamp: makeTime(3, 20),
      isEdited: false,
      reactions: [{ emoji: '👍', count: 3, users: ['user-1', 'user-3', 'user-5'] }],
    },
    {
      id: 'msg-2',
      channelId: 'ch-general',
      author: mockUsers[2],
      content: 'Looks great! The new color tokens are much more consistent now. I especially like how the hover states feel.',
      timestamp: makeTime(3, 15),
      isEdited: false,
      reactions: [],
    },
    {
      id: 'msg-3',
      channelId: 'ch-general',
      author: mockUsers[0],
      content: 'Nice work @Sarah. Quick question — are we going with the 4px or 8px border radius for cards? I saw both in the Figma.',
      timestamp: makeTime(3, 10),
      isEdited: false,
      reactions: [],
    },
    {
      id: 'msg-4',
      channelId: 'ch-general',
      author: mockUsers[1],
      content: '8px for cards, 4px for buttons and inputs. I\'ll update the spec doc today.',
      timestamp: makeTime(3, 5),
      isEdited: false,
      reactions: [{ emoji: '✅', count: 2, users: ['user-1', 'user-3'] }],
    },
    {
      id: 'msg-5',
      channelId: 'ch-general',
      author: mockUsers[4],
      content: 'Hey team, the sprint review is at 3pm today. Please have your demos ready. We\'ll be presenting to stakeholders.',
      timestamp: makeTime(2, 30),
      isEdited: false,
      reactions: [{ emoji: '👀', count: 4, users: ['user-1', 'user-2', 'user-3', 'user-4'] }],
    },
    {
      id: 'msg-6',
      channelId: 'ch-general',
      author: mockUsers[3],
      content: 'Will do! I have the new onboarding flow ready to show. Also integrated the analytics tracking we discussed last week.',
      timestamp: makeTime(2, 20),
      isEdited: true,
      reactions: [],
    },
    {
      id: 'msg-7',
      channelId: 'ch-general',
      author: mockUsers[0],
      content: 'Perfect. I\'ll present the API migration progress — we\'ve moved 80% of the endpoints to the new gateway.',
      timestamp: makeTime(2, 10),
      isEdited: false,
      reactions: [{ emoji: '🚀', count: 5, users: ['user-2', 'user-3', 'user-4', 'user-5', 'user-1'] }],
      threadCount: 3,
    },
    {
      id: 'msg-8',
      channelId: 'ch-general',
      author: mockUsers[2],
      content: 'That\'s impressive progress! Are there any breaking changes we should know about?',
      timestamp: makeTime(1, 45),
      isEdited: false,
      reactions: [],
    },
    {
      id: 'msg-9',
      channelId: 'ch-general',
      author: mockUsers[0],
      content: 'Nothing breaking for the frontend. The response shapes are identical — we\'re just changing the routing layer underneath. I documented everything in Notion.',
      timestamp: makeTime(1, 30),
      isEdited: false,
      reactions: [{ emoji: '🙏', count: 2, users: ['user-2', 'user-4'] }],
    },
    {
      id: 'msg-10',
      channelId: 'ch-general',
      author: mockUsers[4],
      content: 'Also reminder: we have a team dinner at 7pm tonight at the usual place. Please RSVP in the thread if you haven\'t already! 🍕',
      timestamp: makeTime(0, 45),
      isEdited: false,
      reactions: [
        { emoji: '🍕', count: 3, users: ['user-1', 'user-2', 'user-3'] },
        { emoji: '🎉', count: 2, users: ['user-1', 'user-4'] },
      ],
      threadCount: 7,
    },
  ],
};

// ─── Service Implementation ─────────────────────────────────

export class MockChatService implements ChatService {
  private messageStore: Record<string, Message[]> = { ...mockMessages };

  async getChannels(): Promise<Channel[]> {
    // Simulate network delay
    await this.delay(100);
    return [...mockChannels];
  }

  async getChannel(channelId: string): Promise<Channel | null> {
    await this.delay(50);
    return mockChannels.find(ch => ch.id === channelId) ?? null;
  }

  async getMessages(channelId: string): Promise<Message[]> {
    await this.delay(150);
    return this.messageStore[channelId] ?? [];
  }

  async sendMessage(channelId: string, content: string, author: User): Promise<Message> {
    await this.delay(50);

    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      channelId,
      author,
      content,
      timestamp: new Date(),
      isEdited: false,
      reactions: [],
    };

    if (!this.messageStore[channelId]) {
      this.messageStore[channelId] = [];
    }
    this.messageStore[channelId].push(newMessage);

    return newMessage;
  }

  async getUsers(): Promise<User[]> {
    await this.delay(100);
    return [...mockUsers];
  }

  async getCurrentUser(): Promise<User> {
    await this.delay(50);
    return mockUsers[0]; // Jungwoo as current user
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/** Singleton instance for the mock service */
export const chatService: ChatService = new MockChatService();
