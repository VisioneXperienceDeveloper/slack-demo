# Database Schema

The backend uses **Convex**, a real-time transactional database. The schema is strictly typed and optimized for relational-style queries in a NoSQL environment.

## Table Definitions

### `users`
Stores user profile information synced from Clerk.
- `name`: (Optional) Display name.
- `image`: (Optional) Profile picture URL.
- `externalId`: Clerk's unique user ID (Index: `by_externalId`).
- `email`: Primary email address.

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
- Indexes: `by_userId`, `by_workspaceId`, `by_userId_and_workspaceId`.

### `channels`
Chat areas within a workspace.
- `name`: Channel name.
- `workspaceId`: Reference to `workspaces`.
- `description`: (Optional) Purpose of the channel.
- `isPrivate`: Boolean visibility flag.
- `createdAt`: Timestamp.

### `messages`
The core communication entity.
- `body`: Text content of the message.
- `authorId`: Reference to `users`.
- `channelId`: Reference to `channels`.
- `workspaceId`: Reference to `workspaces`.
- `updatedAt`: (Optional) Last edit timestamp.
- Indexes: `by_channelId`, `by_workspaceId`.

## Query Patterns
- **Join-like**: Convex doesn't have traditional SQL joins. Relationships are handled by querying indexes (e.g., fetching all members for a `workspaceId`).
- **Real-time**: Any query used in a React component automatically becomes a "subscription", updating the UI as the data changes.
