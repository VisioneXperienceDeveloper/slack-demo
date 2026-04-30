# Architecture Overview

This project implements a **Vertical Slice Architecture**. Instead of traditional horizontal layers, the codebase is split into "slices" that contain everything needed for a specific feature.

## Directory Structure

```text
src/
├── app/              # Routing, Layouts, and Pages (Next.js App Router)
├── features/         # Feature-specific code (The "Slices")
│   └── chat/         # Chat feature slice
│       ├── components/ # Feature-specific UI components
│       ├── domain/     # Business logic and types
│       ├── services/   # Data fetching and external API calls
│       ├── ChatView.tsx # Main entry point for the feature
│       └── index.ts    # Public API for the feature
├── shared/           # Cross-cutting concerns
│   ├── components/   # Common UI components (buttons, inputs, etc.)
│   ├── types/        # Global TypeScript interfaces
│   └── hooks/        # Shared React hooks
```

## Key Principles

1. **Feature Encapsulation**: Each feature should be as self-contained as possible.
2. **Shared Foundation**: Common UI elements and utilities reside in `shared/`.
3. **Public API**: Features should export only what's necessary via `index.ts`.
4. **App Router Integration**: Next.js pages in `app/` act as orchestrators, importing views from `features/`.
