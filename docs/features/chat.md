# Chat Feature

The Chat feature is the core functional block of the Slack Clone. It provides a full-featured, real-time messaging experience.

## Components

- **ChatView**: The main container that orchestrates the message flow and channel context.
- **MessageList**: A real-time updating list of messages. Uses Convex `useQuery` for automatic synchronization.
- **MessageInput**: A sophisticated input component for composing and sending messages via Convex mutations.

## Backend Integration (`convex/messages.ts`)

Instead of mock services, the chat feature now uses Convex for real-time data persistence:
- **Queries**: `messages.get` - Fetches messages for a specific channel with optimized indexes.
- **Mutations**: `messages.send` - Handles message creation and broadcasts it to all connected clients.

## Real-time Sync

The Chat feature leverages Convex's subscription model:
1. When a user sends a message, a mutation is called.
2. Convex updates the `messages` table atomically.
3. All clients currently viewing that channel automatically receive the new message through their active query hooks.

## Implementation Details

- **State Management**: Local state is minimized in favor of Convex's server-authoritative state.
- **Styling**: Uses CSS Modules (`ChatView.module.css`) to maintain the sleek, Linear-inspired monochrome aesthetic.
- **Micro-interactions**: Includes animations for new messages and smooth scrolling behaviors.
