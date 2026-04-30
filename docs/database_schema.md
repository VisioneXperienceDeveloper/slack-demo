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

### `messages`
The core communication entity.
- `body`: Text content of the message.
- `authorId`: Reference to `users`.
- `channelId`: Reference to `channels`.
- `workspaceId`: Reference to `workspaces`.
- `updatedAt`: (Optional) Last edit timestamp.
- Indexes: 
  - `by_channelId`: For listing messages in a channel.
  - `by_workspaceId`: For workspace-wide searches or logic.

## Pagination & Optimization
- **Paginated Queries**: Messages are fetched using `paginate()` to ensure performance even with millions of records.
- **Joined Data**: The `list` query for messages automatically joins author data using `ctx.db.get(msg.authorId)` to reduce client-side overhead.
- **Indexes**: All queries are backed by indexes to prevent full-table scans.
