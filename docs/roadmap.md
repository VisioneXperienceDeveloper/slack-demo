# Advanced Project Roadmap: Slack Clone

This document tracks the evolution of the Slack Clone from a base MVP to a high-performance, premium communication platform.

## 📈 Current Status
- **Backend (Convex)**: Fully implemented (Workspaces, Channels, Members, Messages, Threads, Reactions, Conversations).
- **Frontend (Next.js)**: Integrated with Convex queries and mutations.
- **Architecture**: Vertical Slice Architecture + Turborepo.

## 🎯 Next Level: "고도화" (Advanced Enhancements)

### 1. Functional Rich Media
- [ ] **Image Uploads**: Connect `MessageInput` attachment button to Convex `_storage`.
- [ ] **Image Preview**: Full-screen lightbox for clicked images.
- [ ] **File Icons**: Better visualization for non-image attachments.

### 2. Real-time Interactivity
- [ ] **Emoji Picker**: Integrated picker for reactions and message input.
- [ ] **Mention System**: `@` triggers user list autocomplete.
- [ ] **Presence**: "Active" status dots in sidebar.

### 3. Visual & UX Excellence
- [ ] **Premium Design System**: Monochrome, high-contrast, "Linear-style" UI.
- [ ] **Glassmorphism**: Translucent sidebars and headers.
- [ ] **Micro-animations**: Framer Motion for message entrance, sidebar hover, and reaction pops.
- [ ] **Skeleton Loaders**: Better transition from loading to content.

### 4. Advanced Navigation
- [ ] **Global Search**: Cross-channel message search in the header.
- [ ] **Direct Messages UI**: Better separation between channels and DMs in sidebar.
- [ ] **Invite Flow**: Dedicated UI for joining workspaces via code.

---

## 🛠 Guidelines for AI Assistant
- **Aesthetics are priority**: Every UI change must look premium. Use Vanilla CSS with modern tokens.
- **Vertical Slice**: Keep logic within `features/` folders.
- **Safety**: Run `npm run lint` and `npm run build` before pushing.
