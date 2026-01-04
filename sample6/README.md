# TODO App - React + TypeScript + TDD

A simple, fully-tested TODO application built with React, TypeScript, and comprehensive test coverage using TDD methodology.

## 🎯 Features

- ✅ Add tasks (with validation)
- ✅ Mark tasks as complete/incomplete
- ✅ Delete tasks
- ✅ Display task list with empty state
- ✅ Input validation (empty check, 128 character limit)
- ✅ Visual feedback for completed tasks (grayed out)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at [http://localhost:5173/](http://localhost:5173/)

## 🧪 Testing

This project follows **Test-Driven Development (TDD)** with comprehensive test coverage:

### Run All Tests

```bash
npm test
```

### Unit Tests (Vitest + React Testing Library)

```bash
# Run once
npm run test:unit

# Watch mode
npm run test:unit:watch

# UI mode
npm run test:unit:ui
```

**Coverage**: 66 tests across 7 test files

- 11 validation tests
- 17 useTodos hook tests
- 2 EmptyState component tests
- 9 TodoItem component tests
- 7 TodoList component tests
- 11 TodoInput component tests
- 9 TodoApp integration tests

### E2E Tests (Playwright + Cucumber)

```bash
# Run E2E tests (auto-starts dev server)
npm run test:e2e
```

**Coverage**: 21 scenarios, 105 steps

- 7 add task scenarios
- 4 complete task scenarios
- 4 delete task scenarios
- 6 display tasks scenarios

## 📁 Project Structure

```
sample6/
├── src/
│   ├── components/        # React components
│   │   ├── TodoApp.tsx    # Main container
│   │   ├── TodoInput.tsx  # Task input with validation
│   │   ├── TodoList.tsx   # Task list container
│   │   ├── TodoItem.tsx   # Individual task item
│   │   └── EmptyState.tsx # Empty state message
│   ├── hooks/
│   │   └── useTodos.ts    # Custom hook for state management
│   ├── types/
│   │   └── todo.ts        # TypeScript interfaces
│   ├── utils/
│   │   └── validation.ts  # Validation utilities
│   ├── App.tsx            # Root component
│   └── main.tsx           # Entry point
├── tests/
│   ├── unit/              # Unit tests
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   └── e2e/               # E2E tests
│       ├── pages/         # Page Object Models
│       ├── steps/         # Cucumber step definitions
│       └── support/       # Test setup and utilities
├── features/              # Gherkin feature files (BDD)
└── package.json
```

## 🛠️ Tech Stack

- **Framework**: React 19.2.3
- **Language**: TypeScript 5.9.3
- **Build Tool**: Vite 7.3.0
- **Styling**: CSS Modules
- **Unit Testing**: Vitest 4.0.16 + React Testing Library
- **E2E Testing**: Playwright 1.57.0 + Cucumber 12.5.0
- **State Management**: React Hooks (useState)

## 📝 Validation Rules

- Tasks cannot be empty (after trimming whitespace)
- Tasks must be 128 characters or less
- Error messages displayed inline

## 🎨 UI Features

- Gradient background
- Checkbox for task completion
- Grayed-out style for completed tasks
- Delete button for each task
- Empty state message when no tasks
- Error message display for validation failures

## 🔧 Available Scripts

| Command                   | Description                          |
| ------------------------- | ------------------------------------ |
| `npm run dev`             | Start development server             |
| `npm run build`           | Build for production                 |
| `npm run preview`         | Preview production build             |
| `npm test`                | Run all tests (unit + E2E)           |
| `npm run test:unit`       | Run unit tests                       |
| `npm run test:unit:watch` | Run unit tests in watch mode         |
| `npm run test:unit:ui`    | Run unit tests with UI               |
| `npm run test:e2e`        | Run E2E tests with auto-server start |

## 📚 Learning Objectives

This project demonstrates:

- ✅ React function components and hooks
- ✅ TypeScript interfaces and type safety
- ✅ Custom hooks (useTodos)
- ✅ Props typing and component composition
- ✅ Event handling and state management
- ✅ Conditional rendering and list rendering
- ✅ CSS Modules for scoped styling
- ✅ TDD methodology (Red-Green-Refactor)
- ✅ Unit testing with Vitest and React Testing Library
- ✅ E2E testing with Playwright
- ✅ BDD with Cucumber/Gherkin

## 🧑‍💻 Development Notes

### State Management

- Simple `useState` approach (no Redux/Zustand needed for this scope)
- Custom `useTodos` hook encapsulates all TODO logic
- Auto-increment ID generation for tasks

### Testing Strategy

- **Unit tests**: Focus on logic and component behavior
- **E2E tests**: Focus on user flows and integration
- **Page Object Model**: Used for E2E tests to improve maintainability
- **BDD**: Gherkin feature files provide living documentation

### Key Decisions

- No persistence (memory-only storage)
- No backend/API integration
- No routing (single page)
- No authentication
- Focused on learning and testing fundamentals

## 📊 Test Results

All tests passing! ✅

```
Unit Tests:  66/66 passed
E2E Tests:   21/21 scenarios, 105/105 steps passed
```

## 🤝 Contributing

This is a learning project. Feel free to fork and experiment!

## 📄 License

MIT

---

**Built with ❤️ following TDD principles**
