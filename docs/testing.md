# Testing & Development

The project is configured with a modern testing suite to ensure code quality and facilitate rapid development.

## Testing Framework
- **Vitest**: A high-performance test runner compatible with Vite and Next.js.
- **Testing Library**: Used for component-level testing (`@testing-library/react`).

## Mocking Strategy
For scenarios where the live Convex backend is not accessible or for unit testing individual components, the project maintains a sophisticated mocking layer.

### Mock Chat Service (`apps/web/src/features/chat/services/mock-chat.service.ts`)
A legacy but powerful mock implementation that provides:
- **Fake Workspaces, Users, and Channels**.
- **Simulated Latency**: To test loading states and UI transitions.
- **Data Stability**: Consistent data for visual regression or snapshot testing.

## Running Tests
- **Run all tests**: `npm test` (inside `apps/web`)
- **Watch mode**: `npm run test:watch`
- **UI Mode**: `npm run test:ui` (for visual debugging of tests)

## Best Practices
1. **Prefer Integration Tests**: Test components as they interact with Convex hooks.
2. **Use Mocks for Edge Cases**: Use the mock services to simulate network errors or complex data states that are hard to reproduce in the live backend.
3. **Keep Tests Atomic**: Each test should focus on a single piece of functionality.
