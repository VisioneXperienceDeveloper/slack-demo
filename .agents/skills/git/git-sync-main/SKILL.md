---
name: gmain
description: Syncs the local repository by pulling the latest remote main and deleting all other local feature branches to maintain a clean workspace.
---

# Git Sync Main Skill

Use this skill when you want to fast-forward your local `main` branch with the remote `main` and clean up any leftover local feature branches. This is typically done after a batch of Pull Requests have been successfully merged.

## Workflow

1. **Verify State**:
   - Check if there are any uncommitted changes (`git status`). Stash them or confirm with the user before proceeding if there is unsaved work.

2. **Execute Sync and Clean**:
   Run the following commands:
   ```bash
   git checkout main
   git pull origin main
   git branch | grep -v "main" | xargs git branch -D
   git remote prune origin
   ```
   *Note: If there are no other branches, the branch deletion command might fail gracefully, which is expected.*

3. **Status Check**:
   - Run `git status` to confirm that the working directory is clean and the branch is up to date with `origin/main`.

## Guidelines
- **Caution**: Deleting local branches forcefully (`-D`) will remove unmerged commits on those branches. Ensure the user explicitly wants a clean slate.
- **Usage**: You can invoke this skill using `@git-sync-main`.
