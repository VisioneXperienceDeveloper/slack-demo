# Documentation Guidelines

This document outlines the standards for project documentation to ensure consistency, clarity, and maintainability across the codebase.

## 📁 Directory Structure

All documentation must reside in the `/docs` directory:
- `index.md`: The central entry point.
- `architecture.md`: High-level system design and patterns.
- `tech_stack.md`: Tools, frameworks, and versions.
- `database_schema.md`: Table definitions, indexes, and query patterns.
- `authentication.md`: Auth flow and security logic.
- `testing.md`: Testing frameworks and mocking strategies.
- `features/`: Sub-directory for individual feature slices (e.g., `chat.md`, `workspace.md`).

## ✍️ Documentation Principles

### 1. Vertical Slice Documentation
Focus on "features" rather than technical layers. A feature document should cover:
- UI Components.
- Backend logic (Convex functions).
- Data models.
- Real-time/Async behaviors.

### 2. Living Documents
Documentation should evolve with the code. If you:
- Change a database schema → Update `database_schema.md`.
- Switch a library → Update `tech_stack.md`.
- Implement a new feature → Create `docs/features/x.md` and link it in `index.md`.

### 3. Visuals & Examples
- Use **Tables** for color palettes, spacing, or schema definitions.
- Use **Code Blocks** for example mutations, queries, or component usage.
- Use **Mermaid Diagrams** (if available) for complex data flows or auth sequences.

### 4. Professional Tone
Maintain a technical, concise, and professional tone. Focus on "Why" and "How" rather than just "What".

## 🚀 Checklist for New Features
- [ ] Create/Update the feature document in `docs/features/`.
- [ ] Update `database_schema.md` if new tables/indexes were added.
- [ ] Update `docs/index.md` to include the new feature.
- [ ] Verify that the `architecture.md` still accurately reflects the implementation.
