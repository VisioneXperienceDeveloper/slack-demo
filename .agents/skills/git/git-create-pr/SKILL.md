---
name: gpr
description: Pushes local branches to the remote repository and creates Pull Requests on GitHub using appropriate titles and descriptions.
---

# Git Create PR Skill

Use this skill to automate the process of sharing code and requesting reviews on GitHub. It handles the transition from local development to remote integration.

## Workflow

1. **Verify Remote & Local Health**:
   - Ensure a remote named `origin` is configured (`git remote -v`).
   - **MANDATORY**: Run `npm run lint`, `npm run test`, and `npm run build` locally. Do NOT push if any step fails.

2. **Push Branches**:
   - For each local feature branch, run `git push origin <branch-name>`.
   - Ensure the branch is up-to-date with the remote `main` before pushing.

3. **Create Pull Request**:
   - Use the `mcp_github-mcp-server_create_pull_request` tool.
   - **Base**: Usually `main`.
   - **Head**: The feature branch you just pushed.
   - **Title**: Use the main commit message or a concise summary of the feature.
   - **Body**: Provide a clear description of the changes, including:
     - What was implemented.
     - Why it was changed.
     - Any manual verification steps or screenshots (if applicable).

4. **Handle Failures**:
   - If MCP tool fails (e.g., "Bad credentials"), provide the direct GitHub "New Pull Request" URL to the user so they can create it manually.

## Guidelines

- **PR Descriptions**: Be descriptive. Help the reviewer understand the "Why" behind the "What".
- **One PR per Feature**: Avoid grouping unrelated features into a single PR.
- **Environment Context**: If the PR requires specific environment variables or secrets, mention them in the PR body.

## Reference

Follow the CI/CD rules defined in [AGENTS.md](../../../AGENTS.md).
