# Project Development Roadmap: Slack Clone

This document outlines the strategic roadmap for the development of the Slack Clone project. The goal is to move from a mocked UI to a production-ready, feature-rich real-time communication platform.

## 📊 Current State Analysis

- **Frontend**: Next.js 15+ App Router, Vanilla CSS Modules, Vertical Slice Architecture.
- **Backend**: Convex (Real-time DB & Serverless Functions).
- **Authentication**: Clerk (GitHub/Google Social Auth).
- **Architecture**:
  - `apps/web`: Next.js frontend with feature-based slices.
  - `convex/`: Backend schema and functions.
  - `packages/`: Shared logic (UI components, types).
- **Progress**: 
  - [x] Clerk Authentication Setup
  - [x] User Syncing (Clerk -> Convex)
  - [x] Basic Chat UI (Sidebar, MessageList, Input)
  - [ ] **Missing**: Real backend integration for messaging, Workspace/Channel management.

---

## 🚀 Phase 1: Real-time Foundation (MVP)
*Goal: Replace mock data with real-time Convex synchronization.*

- **Database Schema Implementation**:
  - Define `workspaces`, `members`, `channels`, and `messages` tables in `convex/schema.ts`.
  - Establish relationships (e.g., messages belong to channels, members belong to workspaces).
- **Convex Backend Functions**:
  - Create mutations for sending messages and creating channels.
  - Create queries for fetching messages (paginated) and list of channels.
- **Frontend Integration**:
  - Replace `mock-chat.service.ts` with real Convex hooks (`useQuery`, `useMutation`).
  - Implement workspace selection logic.

## 💬 Phase 2: Core Communication Features
*Goal: Implement the "essential" Slack experience.*

- **Threading & Replies**:
  - Support for nested message replies.
  - Sidebar view for "Threads".
- **Emoji Reactions**:
  - Real-time reaction updates using Convex.
- **Rich Text Support**:
  - Markdown rendering for messages.
  - User mentions (@user) with autocomplete.
- **Direct Messages (DMs)**:
  - Private 1:1 and small group conversations.

## 🛠 Phase 3: Utility & Productivity
*Goal: Enhance user workflow and data management.*

- **File & Media Management**:
  - Integration with Convex Uploads or Edgestore for attachments.
  - Image preview and file download capabilities.
- **Presence System**:
  - Real-time "Online/Away" indicators for users.
- **Search Infrastructure**:
  - Full-text search for messages and files using Convex Search indexes.
- **Desktop/Browser Notifications**:
  - Push notifications for mentions and DMs.

## ✨ Phase 4: Premium Experience & Scale
*Goal: Visual excellence and production reliability.*

- **Design Polish (Premium UX)**:
  - Implement "Linear-style" aesthetic (subtle borders, monochrome palette, glassmorphism).
  - Add micro-animations (Framer Motion) for message transitions and sidebar interactions.
- **Advanced Permissions (RBAC)**:
  - Workspace Admin vs. Member roles.
  - Private channel access control.
- **Reliability & Testing**:
  - E2E testing with Playwright.
  - Performance audit for large message lists (virtualization).

---

## 🛠 Technical Directions & Rules

1. **Vertical Slice Architecture**: Continue following the pattern in `apps/web/src/features`.
2. **Convex Guidelines**: Always refer to `convex/_generated/ai/guidelines.md` for backend changes.
3. **Vanilla CSS**: Stick to CSS Modules for premium, custom-tailored designs as per system instructions.
4. **CI/CD**: Adhere to the branching strategy (`main`, `feature/*`, `hotfix/*`) defined in `AGENTS.md`.
