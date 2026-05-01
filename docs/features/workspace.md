# Workspace Feature

The Workspace feature manages the high-level organization, including onboarding, switching between workspaces, and administrative tasks.

## Components

- **Sidebar**: The main navigation hub for channels, DMs, and workspace settings. 
  - **Responsive**: Controlled by `SidebarContext`, it automatically collapses on route changes in mobile views to improve usability.
- **WorkspaceSwitcher**: Allows users to seamlessly jump between different workspaces.
- **WorkspaceOnboarding**: Guided flow for creating or joining a workspace.
- **MembersModal**: Management UI for inviting members and managing roles.
- **ChannelSettingsModal**: Interface for editing channel metadata or deleting channels.
- **ProfileModal**: User profile management and status updates.

## Advanced Management

### 1. Presence System
- Real-time "Online/Offline" status based on the `lastSeen` field in the `users` table.
- Status is updated periodically while the user is active in the application.

### 2. Member Management
- Roles: `owner`, `admin`, `member`.
- Invite system: Uses `joinCode` for controlled workspace entry.

### 3. Navigation (Sidebar)
- Organized by Categories: Channels, Direct Messages, and Threads.
- Dynamic Badge updates for unread messages or mentions.

## Backend Integration (`convex/workspaces.ts`, `convex/users.ts`)

- **Context-Aware Fetching**: Queries are scoped to the active `workspaceId`.
- **Authorization**: Role-based access control (RBAC) enforced on mutations like channel creation or workspace settings updates.
