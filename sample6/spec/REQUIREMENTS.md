# Product Requirements Document

## 1. Project Overview

- **Project Name**: React TODO Learning App
- **Vision**: React 初心者が 1 日で React + TypeScript + テストの基礎を学べるシンプルな TODO 管理アプリ
- **Goals**:
  - React の基本的な概念（コンポーネント、state、イベントハンドリング）を実践的に学ぶ
  - TypeScript による型安全な開発を体験する
  - Vitest/React Testing Library を使った Unit テストの基礎を学ぶ
  - Playwright を使った E2E テストの基礎を学ぶ
  - 1 日で完成させ、動くアプリケーションを作る達成感を得る

## 2. Target Audience

- **誰のためのものか**: 開発者自身（学習目的）
- **ユーザーの課題**: React + TypeScript + テストの基礎を実践的に学びたいが、複雑なアプリは 1 日で完成しない

## 3. Core Features (Scope)

### Must Have (MVP)

- タスクの追加機能（テキスト入力フォーム）
- タスクの削除機能（削除ボタン）
- タスクの完了/未完了切り替え機能（チェックボックスまたはボタン）
- タスクリストの表示
- **LocalStorage によるデータ永続化**
  - タスクの追加・削除・完了切り替え時に自動保存
  - アプリ起動時に localStorage からタスクを読み込み
  - localStorage が利用できない環境でのエラーハンドリング
  - データ破損時のエラーハンドリングとリセット処理
- React 基礎機能の活用：
  - コンポーネント分割
  - useState による状態管理
  - イベントハンドリング
  - リストのレンダリング
- TypeScript による型定義（Todo 型、Props 型など）
- Vitest + React Testing Library による簡素な Unit テスト：
  - コンポーネントのレンダリングテスト
  - ユーザーインタラクションのテスト（簡易的なもの）
  - **localStorage 機能のテスト**
- Playwright による基本的な E2E テスト：
  - タスク追加のテスト
  - タスク完了のテスト
  - タスク削除のテスト
  - **データ永続化のテスト**

### Should Have (v2)

- タスクの編集機能
- タスクのフィルタリング（全て/完了/未完了）
- タスクの優先度設定
- より詳細なテストケース
- テストカバレッジの向上

### Out of Scope (今回はやらない)

- バックエンド API 連携
- ユーザー認証機能
- 複数ユーザー対応
- データベース連携
- デプロイ
- UI ライブラリの使用（TailwindCSS、Material-UI など）
- 包括的なテストカバレッジ（簡素なテストのみ）

## 4. Non-functional Requirements

- **開発環境**: Vite + React + TypeScript
- **テスト環境**:
  - Unit テスト: Vitest + React Testing Library
  - E2E テスト: Playwright
- **ブラウザ対応**: モダンブラウザ（Chrome, Firefox, Safari 最新版）
- **データ保存**: localStorage による永続化
  - ブラウザリロード後もデータが保持される
  - localStorage キー名: `react-todo-app-tasks`
  - データ形式: JSON 配列 `[{id: number, text: string, completed: boolean}, ...]`
- **UI/UX**: シンプルな HTML + CSS（素の CSS）
- **開発期間**: 1 日以内で完成
- **パフォーマンス**: 特別な要件なし（学習用途のため）
- **コード品質**: 初心者が理解しやすいシンプルなコード、TypeScript による型安全性
- **テストポリシー**: 簡素なテストケースで基礎を学ぶことを優先（高いカバレッジは求めない）
