# Chat Feature

The Chat feature provides a high-fidelity, real-time messaging experience with support for advanced Slack-like features.

## Components

- **ChatView**: The main orchestrator for channel-based messaging.
- **MessageList**: Renders the stream of messages with infinite scroll support.
- **MessageBubble**: Renders individual messages with rich metadata (author, timestamp, reactions, images).
- **MessageInput**: A rich-text input area with support for:
  - **Emoji Picker**: Quick access to common emojis.
  - **Image Uploads**: Integration with Convex storage for attachments.
- **ThreadPanel**: A side panel for managing nested message replies (Threading).
- **EmojiPicker**: A dedicated UI for adding reactions to messages.
- **MessageActionsMenu**: Context menu for editing, deleting, or replying to messages.

## Advanced Features

### 1. Threading
- Messages can have replies, creating a nested conversation structure.
- Implementation uses `parentMessageId` in the `messages` table.
- Accessible via the `ThreadPanel` side panel.

### 2. Reactions
- Real-time emoji reactions to any message.
- Multiple users can react with the same emoji (counts are aggregated in the UI).

### 3. File & Image Support
- Direct image uploads via the message input.
- Images are stored in Convex `_storage` and rendered using the `MessageImage` component.

### 4. Direct Messages (DMs)
- 1:1 private conversations between workspace members.
- Managed via the `conversations` table and specialized DM channels.

## Backend Integration (`convex/messages.ts`, `convex/reactions.ts`, `convex/conversations.ts`)

- **Search**: Implemented via `search_body` index for fast message retrieval.
- **Joins**: Author and reaction data are resolved server-side for optimal client performance.

## Real-time Sync
- Uses Convex's subscription engine for instant updates on new messages, reactions, and thread replies.
