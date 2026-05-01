<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->

## CI/CD and Branching Strategy

- **Branching Strategy**:
  - `main`: Production branch. CD is only triggered from this branch.
  - `feature/*`: Development branch for new features.
  - `hotfix/*`: Branch for emergency bug fixes.
- **Continuous Integration (CI)**:
  - All Pull Requests to the `main` branch must pass automated tests, linting, and build checks before they can be merged.
  - **MANDATORY**: AI assistants must run `npm run lint`, `npm run test`, and `npm run build` locally before pushing to any branch or creating a PR.
- **Continuous Deployment (CD)**:
  - Deployment should only occur automatically upon successful merge/push to the `main` branch.

## Coding Standards & Best Practices

- **React Effects & State**:
  - **NEVER** call `setState` synchronously within a `useEffect` hook. This triggers cascading renders and causes `react-hooks/set-state-in-effect` lint errors.
  - **Always** prefer Derived State (e.g. calculating values directly during render) over syncing state via `useEffect`.
- **Import Aliases**:
  - **NEVER** use deeply nested relative paths (e.g., `../../../../convex/_generated/api`) to import Convex modules.
  - **Always** use the `@convex/` path alias (e.g., `import { api } from '@convex/_generated/api'`) to ensure cleaner and more maintainable code. This is enforced by ESLint.
## Documentation Standards

- **Vertical Slice First**: Always document features as complete slices (UI + Backend + Logic).
- **Living Docs**: Update `/docs` immediately whenever the architecture, stack, or schema changes.
- **Entry Point**: Keep `docs/index.md` as the source of truth for all documentation links.
- **Reference**: Follow the detailed guidelines in [docs/guidelines.md](./docs/guidelines.md).

## Custom Skills

- **@add-docs**: Analyzes the project and updates `/docs` according to the standards. Located in `.agents/skills/docs/add-docs`.
- **@gc**: Groups changes and commits them step-by-step to separate branches. Located in `.agents/skills/git/git-stage-commit`.
- **@gpr**: Pushes branches and creates Pull Requests on GitHub. Located in `.agents/skills/git/git-create-pr`.
- **@gmain**: Syncs the local repository by pulling the latest remote main and deleting all other local feature branches to maintain a clean workspace. Located in `.agents/skills/git/git-sync-main`.
- **@ci**: Runs the mandatory continuous integration checks (lint, test, build) locally to ensure code quality before pushing. Located in `.agents/skills/ci`.
