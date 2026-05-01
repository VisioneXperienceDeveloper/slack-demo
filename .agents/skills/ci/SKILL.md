---
name: ci
description: Runs the mandatory continuous integration checks (lint, test, build) locally before pushing changes.
---

# Local CI Skill

Use this skill when the user explicitly requests to run CI checks locally (e.g., via `@ci`). This automates the execution of local verification checks, which are mandatory before creating a Pull Request.

## Workflow

1. **Execute Checks Sequence**:
   - **Lint**: Run `npm run lint`. This checks for code quality, ESLint errors, and standard compliance.
   - **Test**: Run `npm run test` to ensure all unit and integration tests pass.
   - **Build**: Run `npm run build` to verify the project compiles and builds successfully without type errors or Turbopack issues.

   *Note: If any of these commands fail, stop immediately. Do not proceed to the next command.*

2. **Handle Results**:
   - **Success**: If all checks pass, inform the user that the local CI checks have completed successfully and the code is ready for staging or pushing.
   - **Failure**: If any check fails, provide a summary of the exact error and offer to troubleshoot and fix the issue.

## Guidelines
- **Mandatory Sequence**: Always run `lint`, `test`, and `build` in order.
- **Verification Only**: This skill should only verify the code. Do not automatically create a branch, push, or commit unless the user explicitly combines this with other skills like `@gc` or `@gpr`.
