---
name: add-docs
description: Analyzes the current project state and updates or creates comprehensive documentation in the /docs directory.
---

# Add Docs Skill

Use this skill when the user asks to document the project, update existing docs, or when you notice the documentation has fallen behind the implementation.

## Workflow

1. **Analyze Project State**:
   - Check the root structure (Monorepo vs Single App).
   - Identify core technologies (Next.js, Convex, Clerk, etc.).
   - Inspect the `features/` directory to identify functional slices.
   - Read the database schema (e.g., `convex/schema.ts`).

2. **Validate/Initialize Docs Structure**:
   - Ensure `/docs` exists.
   - Ensure `docs/index.md` exists and serves as a central entry point.
   - Maintain the standard set of documents: `architecture.md`, `tech_stack.md`, `database_schema.md`, `authentication.md`, `testing.md`, and `guidelines.md`.

3. **Update Feature Docs**:
   - For each feature in `src/features`, ensure there is a corresponding doc in `docs/features/`.
   - Update existing feature docs to reflect current implementation details (UI components, Backend functions, Data flow).

4. **Synchronize Changes**:
   - If the tech stack or architecture has changed, update `tech_stack.md` and `architecture.md` immediately.
   - If the database schema has changed, update `database_schema.md`.

## Guidelines

- **Vertical Slice First**: Document features as complete units (UI + Backend + Logic).
- **Technical Accuracy**: Ensure that function names, table names, and directory paths match the actual code.
- **Rich Formatting**: Use tables for definitions, code blocks for examples, and keep hierarchies clear.
- **Self-Documenting**: Ensure `docs/index.md` is always up-to-date with links to all other documents.

## Reference

Follow the detailed project documentation rules in [docs/guidelines.md](../../../docs/guidelines.md) and [AGENTS.md](../../../AGENTS.md).
