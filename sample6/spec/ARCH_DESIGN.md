# Architecture Design

## 1. Technology Stack

### Core Technologies

- **Language**: TypeScript 5.x
  - 型安全性を学習するため
  - React のベストプラクティスに沿った開発体験
- **Build Tool**: Vite 5.x
  - 高速な開発サーバー起動
  - HMR (Hot Module Replacement) による即座のフィードバック
- **Frontend Framework**: React 18+
  - useState による状態管理の基礎学習
  - 関数コンポーネントとフックの習得

### Testing Stack

- **Unit/Component Testing**:
  - Vitest (Vite ネイティブのテストランナー)
  - React Testing Library (コンポーネントテスト)
  - @testing-library/jest-dom (アサーション拡張)
- **BDD/E2E Testing**:
  - Playwright (ブラウザ自動化)
  - @cucumber/cucumber (Gherkin 実行エンジン)
  - Cucumber HTML Reporter (レポート生成)

### Styling

- **CSS Strategy**: CSS Modules
  - コンポーネント単位のスタイルスコープ
  - 命名衝突の回避
  - TypeScript による型補完サポート

### Development Tools

- **Package Manager**: npm (Node.js 標準)
- **Linter**: ESLint with TypeScript plugin
- **Formatter**: Prettier (オプション)

## 2. Directory Structure

```
sample6/
├── public/                          # 静的ファイル
│   └── vite.svg
├── src/                             # ソースコード
│   ├── components/                  # React コンポーネント
│   │   ├── TodoApp.tsx              # ルートコンポーネント
│   │   ├── TodoApp.module.css       # TodoApp のスタイル
│   │   ├── TodoInput.tsx            # タスク入力フォーム
│   │   ├── TodoInput.module.css
│   │   ├── TodoList.tsx             # タスクリスト表示
│   │   ├── TodoList.module.css
│   │   ├── TodoItem.tsx             # 個別タスク要素
│   │   ├── TodoItem.module.css
│   │   ├── EmptyState.tsx           # 空状態表示
│   │   └── EmptyState.module.css
│   ├── hooks/                       # カスタムフック
│   │   └── useTodos.ts              # タスク管理ロジック
│   ├── types/                       # TypeScript 型定義
│   │   └── todo.ts                  # Todo 型、TodoStatus 型など
│   ├── utils/                       # ユーティリティ関数
│   │   └── validation.ts            # バリデーション関数
│   ├── App.tsx                      # アプリケーションエントリ
│   ├── App.css                      # グローバルスタイル
│   ├── main.tsx                     # React レンダリングエントリ
│   ├── index.css                    # CSS リセット・基本スタイル
│   └── vite-env.d.ts                # Vite 型定義
├── tests/                           # テストファイル
│   ├── unit/                        # Unit テスト
│   │   ├── components/
│   │   │   ├── TodoApp.test.tsx
│   │   │   ├── TodoInput.test.tsx
│   │   │   ├── TodoList.test.tsx
│   │   │   └── TodoItem.test.tsx
│   │   ├── hooks/
│   │   │   └── useTodos.test.ts
│   │   └── utils/
│   │       └── validation.test.ts
│   └── e2e/                         # E2E テスト (Cucumber)
│       ├── steps/                   # ステップ定義
│       │   ├── add_task.steps.ts
│       │   ├── complete_task.steps.ts
│       │   ├── delete_task.steps.ts
│       │   └── display_tasks.steps.ts
│       ├── support/                 # テストサポート
│       │   ├── world.ts             # Cucumber World 設定
│       │   └── hooks.ts             # Before/After フック
│       └── pages/                   # Page Object Pattern
│           └── TodoPage.ts          # TODO ページのオブジェクト
├── features/                        # Gherkin 仕様ファイル
│   ├── add_task.feature
│   ├── add_task.feature.ja
│   ├── complete_task.feature
│   ├── complete_task.feature.ja
│   ├── delete_task.feature
│   ├── delete_task.feature.ja
│   ├── display_tasks.feature
│   └── display_tasks.feature.ja
├── REQUIREMENTS.md                  # プロダクト要件定義
├── ARCH_DESIGN.md                   # アーキテクチャ設計書（本ファイル）
├── package.json                     # 依存関係
├── tsconfig.json                    # TypeScript 設定
├── tsconfig.node.json               # Node.js 用 TypeScript 設定
├── vite.config.ts                   # Vite 設定
├── vitest.config.ts                 # Vitest 設定
├── cucumber.js                      # Cucumber 設定
├── playwright.config.ts             # Playwright 設定
├── .gitignore
└── index.html                       # HTML エントリポイント
```

## 3. Implementation Policy

### 3.1 状態管理の方針

#### 基本原則

- **useState を使用**: React の基本的な状態管理フックを習得
- **単一責任の原則**: 各コンポーネントは明確な責任を持つ
- **カスタムフックでロジック分離**: `useTodos` フックにビジネスロジックを集約

#### 状態構造

```typescript
// types/todo.ts
export interface Todo {
  id: string; // ユニーク ID (UUID または timestamp)
  text: string; // タスクテキスト (1-128文字)
  completed: boolean; // 完了状態
  createdAt: number; // 作成日時 (タイムスタンプ)
}

export type TodoAction =
  | { type: "ADD"; text: string }
  | { type: "DELETE"; id: string }
  | { type: "TOGGLE"; id: string };
```

#### カスタムフック設計

```typescript
// hooks/useTodos.ts
export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addTodo = (text: string): boolean => {
    /* ... */
  };
  const deleteTodo = (id: string): void => {
    /* ... */
  };
  const toggleTodo = (id: string): void => {
    /* ... */
  };

  return { todos, error, addTodo, deleteTodo, toggleTodo };
}
```

### 3.2 エラーハンドリングの共通ルール

#### バリデーション層

```typescript
// utils/validation.ts
export const ValidationError = {
  EMPTY_TASK: "Task cannot be empty",
  TOO_LONG: "Task must be 128 characters or less",
} as const;

export function validateTask(text: string): string | null {
  if (text.trim() === "") {
    return ValidationError.EMPTY_TASK;
  }
  if (text.length > 128) {
    return ValidationError.TOO_LONG;
  }
  return null;
}
```

#### エラー表示方針

- **インライン表示**: 入力フォーム直下にエラーメッセージを表示
- **自動クリア**: ユーザーが入力を開始したらエラーをクリア
- **アクセシビリティ**: `aria-invalid` と `aria-describedby` を使用

### 3.3 コンポーネント設計指針

#### コンポーネント分割戦略

```
TodoApp (Container Component)
├── TodoInput (Presentation Component)
│   └── input, button, error message
├── TodoList (Presentation Component)
│   ├── EmptyState (状態: 0件)
│   └── TodoItem[] (Presentation Component)
│       ├── checkbox (完了切替)
│       ├── text (グレーアウト制御)
│       └── delete button
```

#### Props 設計原則

- **明示的な型定義**: すべての Props に TypeScript 型を定義
- **単方向データフロー**: 親から子への Props、子から親へのコールバック
- **最小限の Props**: 必要な情報のみを渡す

#### コンポーネント例

```typescript
// components/TodoItem.tsx
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  // Implementation
}
```

### 3.4 CSS Modules 命名規則

- **BEM ライクな命名**: `.container`, `.input`, `.button--primary`
- **状態クラス**: `.item--completed`, `.text--grayed`
- **コンポーネント単位**: 各コンポーネントに専用の `.module.css`

### 3.5 テスト戦略

#### Unit テスト (Vitest + RTL)

- **コンポーネント**: レンダリング、Props、イベントハンドリング
- **フック**: 状態変更ロジック、エッジケース
- **ユーティリティ**: バリデーション関数の全パターン

#### E2E テスト (Playwright + Cucumber)

- **Gherkin 仕様**: features/ 内の .feature ファイルを実行
- **Page Object Pattern**: UI 変更に強いテストコード
- **並列実行**: 可能な限り並列でテスト実行

### 3.6 アクセシビリティ指針

- **セマンティック HTML**: `<button>`, `<input>`, `<label>` の適切な使用
- **ARIA 属性**: `role`, `aria-label`, `aria-checked` の適切な設定
- **キーボード操作**: すべての操作をキーボードで実行可能に
- **フォーカス管理**: 視覚的なフォーカスインジケーター

### 3.7 パフォーマンス考慮事項

- **最適化は後回し**: 学習目的のため、まずは動作する実装を優先
- **メモ化不要**: 小規模アプリのため `useMemo`/`useCallback` は使用しない
- **仮想化不要**: タスク数が限定的なため仮想スクロール不要

## 4. 開発フロー

### 4.1 開発ステップ

1. プロジェクトセットアップ (Vite + TypeScript)
2. 型定義の作成 (types/todo.ts)
3. バリデーション関数の実装とテスト
4. カスタムフック (useTodos) の実装とテスト
5. コンポーネントの実装 (下位から上位へ)
6. スタイリング (CSS Modules)
7. E2E テストのステップ定義実装
8. テスト実行と修正

### 4.2 コマンド一覧

```bash
# 開発サーバー起動
npm run dev

# Unit テスト実行
npm run test:unit

# E2E テスト実行
npm run test:e2e

# 全テスト実行
npm run test

# ビルド
npm run build

# プレビュー
npm run preview
```

## 5. 将来拡張への備え (v2 以降)

### アーキテクチャ的な拡張ポイント

- **LocalStorage 永続化**: `useTodos` 内で `useEffect` を追加
- **タスクフィルタリング**: `useTodos` に filter 関数を追加
- **タスク編集**: `TodoItem` に編集モードを追加
- **状態管理ライブラリ**: 複雑化したら Zustand/Jotai に移行可能な設計

### 現在の設計が拡張を容易にする理由

- **ロジックの分離**: カスタムフックで実装の詳細を隠蔽
- **コンポーネントの疎結合**: Props 経由の通信のみ
- **型定義の集約**: 新機能追加時も型安全性を維持
- **テスト基盤**: 新機能追加時も既存テストが壊れない

## 6. 学習ポイント

### React 基礎

- ✅ 関数コンポーネント
- ✅ useState フック
- ✅ Props の型定義
- ✅ イベントハンドリング
- ✅ 条件付きレンダリング
- ✅ リストレンダリング (map)
- ✅ カスタムフック

### TypeScript 基礎

- ✅ Interface と Type
- ✅ Union Types
- ✅ Generics (配列、関数)
- ✅ 型推論
- ✅ オプショナル型

### テスト基礎

- ✅ Component テスト (RTL)
- ✅ ユーザーイベントシミュレーション
- ✅ BDD/Gherkin によるシナリオテスト
- ✅ E2E テストの自動化
- ✅ Page Object Pattern

この設計により、1 日で完成可能かつ、React + TypeScript + テストの基礎を実践的に学べるアーキテクチャが実現できます。
