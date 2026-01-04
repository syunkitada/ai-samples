# Implementation Todo List

## Phase 1: Project Setup & Configuration

- [x] **Setup-1**: Initialize Vite + React + TypeScript project

  - [x] Run `npm create vite@latest . -- --template react-ts`
  - [x] Install dependencies: `npm install`
  - [x] Verify development server: `npm run dev`

- [x] **Setup-2**: Install testing dependencies

  - [x] Install Vitest: `npm install -D vitest @vitest/ui`
  - [x] Install React Testing Library: `npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event`
  - [x] Install Playwright: `npm install -D @playwright/test`
  - [x] Install Cucumber: `npm install -D @cucumber/cucumber`
  - [x] Install jsdom: `npm install -D jsdom`

- [x] **Setup-3**: Configure testing environment

  - [x] Create `vitest.config.ts`
  - [x] Create `playwright.config.ts`
  - [x] Create `cucumber.js`
  - [x] Update `package.json` scripts (test:unit, test:e2e, test)

- [x] **Setup-4**: Setup directory structure
  - [x] Create `src/components/` directory
  - [x] Create `src/hooks/` directory
  - [x] Create `src/types/` directory
  - [x] Create `src/utils/` directory
  - [x] Create `tests/unit/` directory structure
  - [x] Create `tests/e2e/steps/` directory
  - [x] Create `tests/e2e/support/` directory
  - [x] Create `tests/e2e/pages/` directory

## Phase 2: Core Type Definitions & Utilities

- [x] **Core-1**: Create type definitions

  - [x] Implement `src/types/todo.ts` (Todo interface, TodoAction type)

- [x] **Core-2**: Create validation utilities

  - [x] Implement `src/utils/validation.ts`
    - [x] `ValidationError` constants
    - [x] `validateTask()` function (empty check, 128 char limit)

- [x] **Core-3**: Write validation unit tests
  - [x] Test empty string validation
  - [x] Test 128 character limit validation
  - [x] Test valid inputs (1 char, 128 chars, normal text)

## Phase 3: Custom Hook Implementation

- [x] **Hook-1**: Implement `useTodos` custom hook

  - [x] Create `src/hooks/useTodos.ts`
  - [x] Implement state management with `useState<Todo[]>`
  - [x] Implement error state with `useState<string | null>`
  - [x] Implement `addTodo()` function with validation
  - [x] Implement `deleteTodo()` function
  - [x] Implement `toggleTodo()` function

- [x] **Hook-2**: Write useTodos unit tests
  - [x] Test initial state (empty array)
  - [x] Test addTodo with valid input
  - [x] Test addTodo with empty string (should fail)
  - [x] Test addTodo with >128 chars (should fail)
  - [x] Test deleteTodo
  - [x] Test toggleTodo (incomplete -> complete -> incomplete)

## Phase 4: Component Implementation (Bottom-Up)

- [x] **Component-1**: EmptyState component

  - [x] Create `src/components/EmptyState.tsx`
  - [x] Display "No tasks available" message
  - [x] Create `src/components/EmptyState.module.css`

- [x] **Component-2**: TodoItem component

  - [x] Create `src/components/TodoItem.tsx`
  - [x] Implement Props interface (todo, onToggle, onDelete)
  - [x] Render checkbox for completion toggle
  - [x] Render task text with conditional grayed-out style
  - [x] Render delete button
  - [x] Create `src/components/TodoItem.module.css`
  - [x] Apply grayed-out style for completed tasks

- [x] **Component-3**: TodoList component

  - [x] Create `src/components/TodoList.tsx`
  - [x] Implement Props interface (todos, onToggle, onDelete)
  - [x] Render EmptyState when todos.length === 0
  - [x] Render TodoItem for each task
  - [x] Maintain task order (insertion order)
  - [x] Create `src/components/TodoList.module.css`

- [x] **Component-4**: TodoInput component

  - [x] Create `src/components/TodoInput.tsx`
  - [x] Implement Props interface (onAdd, error)
  - [x] Render input field with value state
  - [x] Render add button
  - [x] Render error message when error prop is present
  - [x] Handle form submission (prevent default, call onAdd, clear input)
  - [x] Add ARIA attributes (aria-invalid, aria-describedby)
  - [x] Create `src/components/TodoInput.module.css`

- [x] **Component-5**: TodoApp component (Container)

  - [x] Create `src/components/TodoApp.tsx`
  - [x] Use `useTodos` hook
  - [x] Pass data and callbacks to TodoInput and TodoList
  - [x] Create `src/components/TodoApp.module.css`

- [x] **Component-6**: Update App.tsx
  - [x] Import and render TodoApp component
  - [x] Update `src/App.css` if needed

## Phase 5: Component Unit Tests

- [x] **Test-Component-1**: EmptyState tests

  - [x] Test renders "No tasks available" message

- [x] **Test-Component-2**: TodoItem tests

  - [x] Test renders task text
  - [x] Test checkbox is checked when completed
  - [x] Test checkbox is unchecked when incomplete
  - [x] Test grayed-out style applied when completed
  - [x] Test onToggle callback called on checkbox click
  - [x] Test onDelete callback called on delete button click

- [x] **Test-Component-3**: TodoList tests

  - [x] Test renders EmptyState when no tasks
  - [x] Test renders TodoItem for each task
  - [x] Test renders tasks in correct order
  - [x] Test passes callbacks to TodoItem

- [x] **Test-Component-4**: TodoInput tests

  - [x] Test renders input field and button
  - [x] Test displays error message when error prop provided
  - [x] Test calls onAdd with input value on submit
  - [x] Test clears input after successful submit
  - [x] Test ARIA attributes set correctly

- [x] **Test-Component-5**: TodoApp integration tests
  - [x] Test full add-toggle-delete flow
  - [x] Test error handling for empty input
  - [x] Test error handling for long input

## Phase 6: E2E Test Implementation (Cucumber + Playwright)

- [x] **E2E-Setup-1**: Create Cucumber World and Hooks

  - [x] Implement `tests/e2e/support/world.ts` (Playwright browser context)
  - [x] Implement `tests/e2e/support/hooks.ts` (Before/After hooks)

- [x] **E2E-Setup-2**: Create Page Object

  - [x] Implement `tests/e2e/pages/TodoPage.ts`
    - [x] Method: `goto()`
    - [x] Method: `addTask(text: string)`
    - [x] Method: `deleteTask(text: string)`
    - [x] Method: `toggleTask(text: string)`
    - [x] Method: `getTaskCount()`
    - [x] Method: `getTaskTexts()`
    - [x] Method: `isTaskCompleted(text: string)`
    - [x] Method: `getErrorMessage()`

- [x] **E2E-1**: Add Task feature step definitions

  - [x] Implement `tests/e2e/steps/add_task.steps.ts`
    - [x] Scenario: Successfully add a valid task
    - [x] Scenario: Cannot add an empty task
    - [x] Scenario Outline: Cannot add a task exceeding character limit
    - [x] Scenario: Successfully add a task at maximum length
    - [x] Scenario: Add multiple tasks

- [x] **E2E-2**: Complete Task feature step definitions

  - [x] Implement `tests/e2e/steps/complete_task.steps.ts`
    - [x] Scenario: Mark an incomplete task as complete
    - [x] Scenario: Mark a complete task as incomplete
    - [x] Scenario: Toggle task completion multiple times
    - [x] Scenario: Visual appearance of completed task

- [x] **E2E-3**: Delete Task feature step definitions

  - [x] Implement `tests/e2e/steps/delete_task.steps.ts`
    - [x] Scenario: Delete an incomplete task
    - [x] Scenario: Delete a completed task
    - [x] Scenario: Delete a task from multiple tasks
    - [x] Scenario: Delete all tasks one by one

- [x] **E2E-4**: Display Tasks feature step definitions
  - [x] Implement `tests/e2e/steps/display_tasks.steps.ts`
    - [x] Scenario: Display empty task list
    - [x] Scenario: Display single task
    - [x] Scenario: Display multiple tasks in order
    - [x] Scenario: Display tasks with different completion states
    - [x] Scenario: Task list updates after adding a task
    - [x] Scenario: Task list updates after deleting a task

## Phase 7: Verification & Polish

- [x] **Verify-1**: Run all unit tests

  - [x] Fix any failing unit tests
  - [x] Verify test coverage meets basic requirements (66/66 tests passing)

- [x] **Verify-2**: Run all E2E tests

  - [x] Run `features/add_task.feature` (7 scenarios passing)
  - [x] Run `features/complete_task.feature` (4 scenarios passing)
  - [x] Run `features/delete_task.feature` (4 scenarios passing)
  - [x] Run `features/display_tasks.feature` (6 scenarios passing)
  - [x] Fix any failing scenarios (All 21 scenarios, 105 steps passing!)

- [x] **Verify-3**: Manual testing

  - [x] Test in Chrome
  - [x] Test in Firefox
  - [x] Test keyboard navigation
  - [x] Test accessibility with screen reader

- [x] **Polish-1**: Code quality

  - [x] Add ESLint if not already configured
  - [x] Fix linting errors
  - [x] Add comments for complex logic
  - [x] Review TypeScript strict mode compliance

- [x] **Polish-2**: Documentation
  - [x] Create README.md with setup instructions
  - [x] Document npm scripts
  - [x] Add inline code comments where needed

## Phase 8: Final Deliverables

- [x] **Final-1**: Build production bundle

  - [x] Run `npm run build`
  - [x] Test production build with `npm run preview`

- [x] **Final-2**: Create summary report
  - [x] Document what was learned
  - [x] List all passing tests
  - [x] Note any known issues or limitations

---

## Quick Reference: Feature Coverage

### Add Task (features/add_task.feature)

- [ ] 5 scenarios, ~12 test cases

### Complete Task (features/complete_task.feature)

- [ ] 4 scenarios, ~8 test cases

### Delete Task (features/delete_task.feature)

- [ ] 4 scenarios, ~8 test cases

### Display Tasks (features/display_tasks.feature)

- [ ] 6 scenarios, ~12 test cases

**Total**: 19 scenarios, ~40 test cases
