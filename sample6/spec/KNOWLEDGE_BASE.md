# Project Knowledge Base

## 1. Local Development & Testing Tips

### Development Server Management

- **Issue**: E2E テスト実行時に「Port already in use」で失敗する可能性がある。
- **Solution**:
  - テスト開始前に既存の開発サーバープロセスを終了する：`lsof -ti:5173 | xargs kill -9` (Vite のデフォルトポート)
  - または、`npm run test:e2e` コマンドは `start-server-and-test` を使用して自動的にサーバーを起動・停止するため、手動でサーバーを起動しないこと。

### Test Execution Best Practices

- **E2E テストの実行**:
  - `npm run test:e2e` を使用すると、自動的に開発サーバーが起動され、テスト完了後に停止される。
  - 手動で `npm run dev` を実行している場合は、E2E テスト前に停止すること。
- **ユニットテストの実行**:
  - `npm run test:unit` で全ユニットテストを実行。
  - `npm test` で全テスト（ユニット + E2E）を順次実行。

### TypeScript & IDE Configuration

- **Issue**: Vite プロジェクトで型定義が反映されない。
- **Fix**:
  - `tsconfig.json` で `include` 配列に必要なディレクトリが含まれているか確認。
  - エディタの TypeScript Server を再起動する（VS Code: `Cmd/Ctrl + Shift + P` → "TypeScript: Restart TS Server"）。

## 2. Common Errors & Fixes

### Cucumber/Playwright Integration

- **Error**: `todoPage` が undefined になる（グローバル変数の初期化問題）。
- **Fix**:
  - `tests/e2e/steps/*.steps.ts` の各ファイルで、`Before` フック内で `todoPage` を初期化する。
  - または、各ステップ関数内で `this.todoPage` として World オブジェクトから取得する。
  - 実装例：
    ```typescript
    Before(async function (this: TodoWorld) {
      this.todoPage = new TodoPage(this.page);
    });
    ```

### CSS Modules vs Regular CSS

- **Issue**: CSS Modules のインポート方法が正しくないと、スタイルが適用されない。
- **Problem**: `import './Component.module.css'` とグローバルインポートしても、CSS Modules は適用されない。
- **Solution**:
  - CSS Modules として使用する場合：
    ```typescript
    import styles from './Component.module.css';
    <div className={styles.className}>
    ```
  - グローバル CSS として使用する場合：
    - ファイル名を `.css` に変更
    - `import './Component.css'` でインポート
    - 通常の `className="className"` で使用

### Vitest Configuration

- **Issue**: Vitest が Playwright のテストファイルを読み込んでエラーになる。
- **Fix**:
  - `vitest.config.ts` の `test.exclude` に E2E テストディレクトリを追加：
    ```typescript
    test: {
      exclude: ['**/node_modules/**', '**/dist/**', '**/tests/e2e/**'],
    }
    ```

### ESLint Configuration

- **Setup**: ESLint 9+ の Flat Config 形式を使用。
- **Configuration File**: `eslint.config.js` (ESM format)
- **Installed Packages**:
  - `eslint`
  - `@eslint/js`
  - `typescript-eslint`
  - `@typescript-eslint/parser`
  - `@typescript-eslint/eslint-plugin`
  - `eslint-plugin-react`
  - `eslint-plugin-react-hooks`
- **Key Settings**:
  - React 17+ なので `react/react-in-jsx-scope` は off
  - TypeScript で型チェックするため `react/prop-types` は off
  - `react-hooks/rules-of-hooks` と `react-hooks/exhaustive-deps` を有効化
  - 未使用変数は警告レベル、`_` で始まる変数は除外
- **Scripts**:
  - `npm run lint`: コードをチェック
  - `npm run lint:fix`: 自動修正可能な問題を修正

### Type Definitions

- **Error**: Todo インターフェースの `id` や `task` プロパティで型エラーが発生。
- **Fix**:
  - `src/types/todo.ts` で正しく型定義を行う：
    ```typescript
    export interface Todo {
      id: number;
      task: string;
      completed: boolean;
    }
    ```
  - コンポーネントやフックで一貫して `Todo` 型を使用する。

### Test Assertions

- **Issue**: E2E テストで「task is marked as complete」ステップが未実装だった。
- **Solution**:
  - `isTaskCompleted(text: string)` メソッドを TodoPage に実装。
  - チェックボックスの `checked` 属性を確認する：
    ```typescript
    async isTaskCompleted(text: string): Promise<boolean> {
      const checkbox = this.page.locator(`input[type="checkbox"][aria-label*="${text}"]`);
      return await checkbox.isChecked();
    }
    ```

## 3. Implementation Patterns

### Validation Pattern

- **パターン**: 入力バリデーションは専用のユーティリティ関数で実装し、フック内で呼び出す。
- **実装**:

  ```typescript
  // src/utils/validation.ts
  export const validateTask = (task: string): string | null => {
    const trimmed = task.trim();
    if (!trimmed) return ValidationError.EMPTY;
    if (trimmed.length > 128) return ValidationError.TOO_LONG;
    return null;
  };

  // src/hooks/useTodos.ts
  const addTodo = (task: string) => {
    const validationError = validateTask(task);
    if (validationError) {
      setError(validationError);
      return;
    }
    // ... add logic
  };
  ```

### Component Composition Pattern

- **パターン**: ボトムアップでコンポーネントを実装（EmptyState → TodoItem → TodoList → TodoInput → TodoApp）。
- **利点**:
  - 小さなコンポーネントから順にテストできる。
  - 依存関係が明確になる。
  - 再利用性が高まる。

### Test-Driven Development (TDD)

- **プロセス**: Red → Green → Refactor
  1. **Red**: テストを先に書き、失敗を確認。
  2. **Green**: テストをパスする最小限の実装。
  3. **Refactor**: コードを整理・最適化。
- **実装時の流れ**:
  1. ユーティリティのユニットテストを作成。
  2. カスタムフック（useTodos）のユニットテストを作成。
  3. 各コンポーネントのユニットテストを作成。
  4. E2E テストを作成。
  5. 各段階でテストをパスさせながら実装。

### E2E Test Structure

- **Page Object Pattern**: すべてのページ操作を `tests/e2e/pages/TodoPage.ts` に集約。
- **Step Definitions**: 各フィーチャーごとに別ファイル（`add_task.steps.ts`, `complete_task.steps.ts`, etc.）に分離。
- **World Object**: Playwright の `Page` オブジェクトを World に保持し、ステップ間で共有。

### CSS Modules Pattern

- **パターン**: 各コンポーネントに対応する `.module.css` ファイルを作成。
- **命名規則**: `ComponentName.module.css` （例: `TodoItem.module.css`）
- **利点**: スタイルのスコープが自動的に分離され、命名衝突を防げる。

## 4. Testing Strategy

### Unit Testing Coverage

- **対象**:
  - ユーティリティ関数（`validation.ts`）: 11 tests
  - カスタムフック（`useTodos`）: 17 tests
  - 各コンポーネント: 38 tests (EmptyState: 2, TodoItem: 9, TodoList: 7, TodoInput: 11, TodoApp: 9)
- **合計**: 66 tests

### E2E Testing Coverage

- **対象**:
  - タスク追加機能: 7 scenarios
  - タスク完了機能: 4 scenarios
  - タスク削除機能: 4 scenarios
  - タスク表示機能: 6 scenarios
- **合計**: 21 scenarios, 105 steps

### Test Script Configuration

```json
{
  "test:unit": "vitest",
  "test:e2e": "start-server-and-test 'npm run dev' http://localhost:5173 'cucumber-js'",
  "test": "npm run test:unit && npm run test:e2e"
}
```

## 5. Lessons Learned

### What Worked Well

1. **TDD Approach**: テストファーストで実装することで、要件が明確になり、リファクタリングが容易になった。
2. **Bottom-Up Component Design**: 小さなコンポーネントから実装することで、テストと実装が並行して進められた。
3. **Page Object Pattern**: E2E テストのメンテナンス性が向上した。
4. **TypeScript Strict Mode**: 型安全性により、バグを早期に発見できた。

### Challenges & Solutions

1. **Challenge**: Cucumber と Playwright の統合が複雑だった。

   - **Solution**: World オブジェクトで Browser/Page を管理し、Before/After フックで適切に初期化・クリーンアップ。

2. **Challenge**: E2E テストのセレクタが壊れやすい。

   - **Solution**: ARIA ラベルやデータ属性を使用して、より安定したセレクタを実装。

3. **Challenge**: エラーハンドリングのテストが難しい。
   - **Solution**: エラーステートを明示的に管理し、各ステップでエラーメッセージの表示/非表示を確認。

### Future Improvements

- **localStorage 永続化**: 現在はメモリ内のみでタスクを管理しているため、リロードすると消える。
- **タスク編集機能**: 既存タスクのテキストを編集する機能。
- **フィルタリング**: All/Active/Completed フィルター。
- **Prettier**: コードフォーマッターの追加。
- **CI/CD**: GitHub Actions でテストを自動実行。

## 6. Performance Notes

- **Build Time**: Production build は約 1-2 秒で完了。
- **Test Execution Time**:
  - Unit tests: 約 1-2 秒
  - E2E tests: 約 10-15 秒（サーバー起動時間を含む）
- **Development Server**: Vite の HMR により、変更が即座に反映される。

## 7. Accessibility Considerations

### ARIA Attributes Implementation

- **Input Field Validation**:

  - Use `aria-invalid="true"` when validation error occurs
  - Use `aria-invalid="false"` when input is valid
  - Link error messages with `aria-describedby` pointing to error element's ID
  - Example:
    ```tsx
    <input
      aria-invalid={error ? "true" : "false"}
      aria-describedby={error ? "error-message" : undefined}
    />;
    {
      error && <div id="error-message">{error}</div>;
    }
    ```

- **Interactive Elements**:
  - Add descriptive `aria-label` to all buttons and inputs
  - Include context in labels (e.g., "Delete Task Name" instead of just "Delete")
  - For checkboxes, include the task name: `aria-label="Toggle Task Name"`
  - Example:
    ```tsx
    <button aria-label={`Delete ${todo.task}`}>Delete</button>
    ```

### Keyboard Navigation

- **Supported Keys**:
  - `Tab`: Navigate between interactive elements
  - `Space`: Toggle checkboxes
  - `Enter`: Submit forms and activate buttons
- **Testing Approach**:
  - Use Playwright's `keyboard.press()` to simulate keyboard events
  - Use `element.focus()` to ensure correct focus before key press
  - Verify state changes after keyboard interactions

### Screen Reader Support

- **Best Practices**:
  - Use semantic HTML elements (`<button>`, `<input type="checkbox">`)
  - Provide meaningful `aria-label` attributes
  - Ensure error messages are associated with form fields via `aria-describedby`
  - Use proper heading hierarchy
- **Testing**:
  - Verify all interactive elements have appropriate ARIA labels
  - Test with actual screen readers (NVDA, JAWS, VoiceOver) for production apps
  - Use Playwright to verify ARIA attributes programmatically

### Visual Accessibility

- **Completed Tasks Styling**:
  - Use both visual cues: `text-decoration: line-through` and `color: #999`
  - Ensure sufficient color contrast for readability
  - Don't rely solely on color to convey meaning
- **CSS Implementation**:
  ```css
  .completed {
    color: #999;
    text-decoration: line-through;
  }
  ```

## 8. Manual Testing Best Practices

### Automated Manual Testing

- **Pattern**: Create Playwright tests to automate manual verification tasks
- **Benefits**:
  - Repeatable and consistent testing
  - CI/CD integration
  - Faster regression testing
  - Documentation of expected behavior

### Test Coverage for Manual Verification

1. **Browser Compatibility**: Test basic functionality in target browsers
2. **Keyboard Navigation**: Verify all features accessible via keyboard
3. **Accessibility**: Test ARIA attributes and screen reader compatibility
4. **Visual Appearance**: Verify CSS styling is correctly applied
5. **Edge Cases**: Test boundary conditions and error states

### Implementation Example

```typescript
test("Keyboard navigation", async ({ page }) => {
  const input = page.getByRole("textbox", { name: /task/i });
  await input.focus();
  await page.keyboard.type("Test task");
  await page.keyboard.press("Enter");

  const checkbox = page.locator('input[type="checkbox"]').first();
  await checkbox.focus();
  await page.keyboard.press("Space");
  await expect(checkbox).toBeChecked();
});
```

## 9. Code Documentation Standards

### JSDoc Comments

- **Functions**: すべてのエクスポートされた関数に JSDoc コメントを追加
- **Components**: React コンポーネントに説明と Props のドキュメントを追加
- **Complex Logic**: 複雑なビジネスロジックには詳細な説明を追加

### Documentation Format

```typescript
/**
 * Brief description of what the function/component does.
 *
 * Additional details about implementation, behavior, or usage.
 * Can be multiple paragraphs if needed.
 *
 * @param paramName - Description of the parameter
 * @returns Description of the return value
 */
```

### Best Practices

1. **Be Concise**: コメントは簡潔で意味のあるものにする
2. **Explain Why, Not What**: コードが何をするかではなく、なぜそうするかを説明
3. **Keep Updated**: コードを変更したらコメントも更新
4. **Use TypeScript Types**: 型情報で表現できることはコメントで繰り返さない

## 10. Project Completion Checklist

### Code Quality ✅

- [x] ESLint configured and passing
- [x] TypeScript strict mode enabled
- [x] 0 type errors
- [x] 0 linting errors/warnings
- [x] JSDoc comments on all major functions and components

### Testing ✅

- [x] 66 unit tests passing
- [x] 21 E2E scenarios (105 steps) passing
- [x] 7 manual verification tests passing
- [x] All tests documented and maintainable

### Accessibility ✅

- [x] ARIA attributes implemented
- [x] Keyboard navigation supported
- [x] Screen reader compatible
- [x] Semantic HTML used throughout

### Documentation ✅

- [x] README.md with setup instructions
- [x] PROJECT_SUMMARY.md with project overview
- [x] KNOWLEDGE_BASE.md with lessons learned
- [x] Inline code documentation (JSDoc)
- [x] All npm scripts documented

### Production Readiness ✅

- [x] Production build successful
- [x] No console errors or warnings
- [x] Performance optimized (Vite + React)
- [x] Code well-organized and maintainable
