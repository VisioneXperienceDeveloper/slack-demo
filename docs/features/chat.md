# Chat Feature

The Chat feature is the core functional block of the Slack Clone. It provides a real-time (mocked) messaging interface.

## Components

- **ChatView**: The main container that integrates the message list and message input.
- **MessageList**: Displays the history of messages in a channel.
- **MessageInput**: Handles new message composition and submission.

## Domain Models (`domain/models.ts`)

Defines the core entities:
- `Message`: Represents a single chat message (ID, content, author, timestamp).
- `User`: Represents a user in the system.
- `Channel`: Represents a chat channel or workspace.

## Services

- **ChatService**: Abstract interface for chat operations.
- **MockChatService**: A robust mock implementation that provides:
  - Simulated message history.
  - Mocked user interactions.
  - Asynchronous behavior simulation to mimic real network latency.

## Implementation Details

- **State Management**: Uses React state hooks within `ChatView` to manage message flow.
- **Styling**: Uses CSS Modules (`ChatView.module.css`) to achieve a sleek, Linear-inspired monochrome aesthetic.
- **Responsiveness**: Designed to work across different viewport sizes with a focus on desktop productivity.
