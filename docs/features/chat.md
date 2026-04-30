# Chat Feature

The Chat feature provides a high-fidelity, real-time messaging experience using Convex's reactive engine.

## Components

- **ChatView**: The main orchestrator. It manages:
  - Channel metadata fetching via `api.channels.get`.
  - Paginated message fetching via `usePaginatedQuery`.
  - Message submission via `useMutation`.
- **MessageList**: Renders the stream of messages. It handles:
  - Infinite scrolling (via pagination results).
  - Loading states for initial and subsequent pages.
- **MessageInput**: A sophisticated input area with support for rich content and submission handling.

## Backend Logic (`convex/messages.ts`)

### `list` (Query)
- Implements **Pagination** to handle large chat histories.
- **Data Joining**: Automatically resolves `authorId` to a full `user` object before returning to the client.
- **Ordering**: Returns messages in descending order (newest first) for efficient pagination, which the client then reverses for display.

### `send` (Mutation)
- **Authorization**: Validates that the user is a member of the workspace before allowing the message to be saved.
- **Persistence**: Saves the message to the `messages` table and triggers a real-time update for all subscribers.

## Real-time Sync

1. **State Consistency**: Convex ensures that all clients see the same state of the database.
2. **Subscriptions**: The `useQuery` and `usePaginatedQuery` hooks automatically subscribe to data changes.
3. **Atomic Updates**: Mutations are transactional, ensuring no partial data is written.

## Performance
- **Indexed Access**: Messages are always filtered by `channelId` using a dedicated index.
- **Efficient Joins**: Author data is fetched in parallel using `Promise.all` in the query handler.
