---
name: git-stage-commit
description: Groups local changes into logical slices, creates feature branches, and commits them step-by-step to maintain a clean history.
---

# Git Stage Commit Skill

Use this skill when you have multiple changes in the working directory that belong to different features or logical units. This skill helps ensure a clean, atomic commit history.

## Workflow

1. **Analyze Working Directory**:
   - Run `git status` to identify all modified and untracked files.
   - Group files into logical "Vertical Slices" (e.g., Auth, Database, UI Refinement, Documentation).

2. **Branching Strategy**:
   - For each logical group, identify the appropriate branch name prefix:
     - `feature/`: For new features or significant enhancements.
     - `bugfix/` or `hotfix/`: For bug fixes.
     - `docs/`: For documentation-only changes.
     - `refactor/`: For code cleanup without functional changes.

3. **Step-by-Step Committing**:
   - **Reset/Stash**: If needed, `git reset` or `git stash` to start from a clean state.
   - **Checkout Branch**: Create and switch to the target branch from `main`.
   - **Selective Staging**: Use `git add <files>` for only the files relevant to the current stage.
   - **Atomic Commit**: Commit with a descriptive, conventional message (e.g., `feat: ...`, `fix: ...`, `docs: ...`).
   - **Repeat**: Repeat for all logical groups identified in step 1.

## Guidelines

- **Atomic Commits**: Each commit should represent a single, functional change.
- **Branch Independence**: Ideally, branches should be created from `main` unless one depends on another.
- **Conventional Commits**: Use clear prefixes like `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `test:`.
- **Verify**: Before committing, ensure the code in the current stage is self-consistent.

## Reference

Follow the branching strategy defined in [AGENTS.md](../../../AGENTS.md).
