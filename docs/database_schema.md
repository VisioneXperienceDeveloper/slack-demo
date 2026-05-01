# Database Schema

The backend uses **Convex**, a real-time transactional database. The schema is strictly typed and optimized for relational-style queries in a NoSQL environment.

## Table Definitions

### `users`
Stores user profile information synced from Clerk.
- `name`: (Optional) Display name.
- `image`: (Optional) Profile picture URL.
- `externalId`: Clerk's unique user ID (Index: `by_externalId`).
- `email`: Primary email address.
- `lastSeen`: (Optional) Timestamp for real-time presence.

### `workspaces`
Represents a group of channels and members.
- `name`: Workspace name.
- `ownerId`: Reference to the `users` table.
- `joinCode`: 6-digit invite code for joining (Index: `by_joinCode`).
- `createdAt`: Timestamp.

### `members`
Joins users to workspaces with specific roles.
- `userId`: Reference to `users`.
- `workspaceId`: Reference to `workspaces`.
- `role`: `"owner" | "admin" | "member"`.
- Indexes: 
  - `by_userId`: Filter workspaces by user.
  - `by_workspaceId`: List all members in a workspace.
  - `by_userId_and_workspaceId`: Efficiently check if a user is in a specific workspace.

### `channels`
Chat areas within a workspace.
- `name`: Channel name (sanitized for URL).
- `workspaceId`: Reference to `workspaces`.
- `description`: (Optional) Purpose of the channel.
- `isPrivate`: Boolean visibility flag.
- `createdAt`: Timestamp.
- `type`: `"channel" | "dm"` (Optional).

### `messages`
The core communication entity.
- `body`: Text content of the message.
- `authorId`: Reference to `users`.
- `channelId`: Reference to `channels`.
- `workspaceId`: Reference to `workspaces`.
- `updatedAt`: (Optional) Last edit timestamp.
- `parentMessageId`: (Optional) Reference to parent message for **Threading**.
- `image`: (Optional) Reference to Convex `_storage` for attachments.
- Indexes: 
  - `by_channelId`: For listing messages in a channel.
  - `by_workspaceId`: For workspace-wide logic.
  - `by_parentMessageId`: For retrieving replies in a thread.
- Search Indexes:
  - `search_body`: Full-text search on message content within a workspace.

### `reactions`
Emoji reactions to messages.
- `messageId`: Reference to `messages`.
- `userId`: Reference to `users`.
- `emoji`: The emoji character/string.
- Indexes: `by_messageId`, `by_messageId_and_userId_and_emoji`.

### `conversations`
Metadata for Direct Messages (1:1 conversations).
- `workspaceId`: Reference to `workspaces`.
- `memberOneId`: Reference to first user.
- `memberTwoId`: Reference to second user.
- `channelId`: Reference to the specialized DM channel.
- Indexes: `by_workspaceId`, `by_members`.

## Pagination & Optimization
- **Paginated Queries**: Messages are fetched using `paginate()` to ensure performance.
- **Search Infrastructure**: Uses Convex Search indexes for high-performance message searching.
- **File Storage**: Integrated with Convex `_storage` for secure image and file handling.
