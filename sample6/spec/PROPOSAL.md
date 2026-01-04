# Change Proposal: localStorage による永続化機能の追加

## 1. Metadata

- **Category**: Feature Request
- **Priority**: Mid
- **Status**: Drafting

## 2. Background & Why (背景と目的)

### Current Problem

- 現在のアプリはメモリのみでタスクを管理しているため、ブラウザをリロードするとすべてのタスクが消失する
- ユーザーが入力したタスクが保存されないため、学習用途としては問題ないが、実用性に欠ける
- localStorage による永続化は React アプリの基本的なデータ管理パターンであり、学習目標の一部として含めることができる

### Value

- **ユーザー価値**: ブラウザをリロードしても、タスクが保持されるため、実用的な TODO アプリとして使える
- **学習価値**: localStorage API の使い方、useEffect によるデータの保存・読み込みパターンを学べる
- **開発者価値**: Phase 10 以降の機能拡張（編集、フィルタリング、優先度）の基盤となる

## 3. Desired Outcome / Goal (期待される結果)

- [ ] タスクを追加した際、即座に localStorage に保存されること
- [ ] タスクを削除した際、即座に localStorage に保存されること
- [ ] タスクの完了状態を切り替えた際、即座に localStorage に保存されること
- [ ] アプリ起動時（初回マウント時）、localStorage からタスクを読み込み、状態を復元すること
- [ ] localStorage が利用できない環境（プライベートモード、容量上限、ブラウザ設定でオフ）の場合、エラーメッセージを表示し、アプリを停止すること
- [ ] localStorage のデータが破損している場合、エラーメッセージを表示し、データをリセット（空リストで再開）すること
- [ ] 初回起動時（localStorage にデータがない場合）、空のタスクリストから開始すること
- [ ] E2E テスト実行時は localStorage をクリアし、既存のテストシナリオが正常に動作すること

## 4. Impact Analysis (影響範囲の予測)

### Affected Features

- **既存の .feature ファイル**: 影響なし（E2E テスト前に localStorage をクリアすることで既存テストを維持）
- **新規 .feature ファイル**: `spec/features/persist_tasks.feature` を追加予定
  - ブラウザリロード後のデータ復元
  - localStorage エラー時の挙動
  - データ破損時の挙動

### Affected Components & Files

- `src/hooks/useTodos.ts`: localStorage への保存・読み込みロジックを追加
- `src/components/TodoApp.tsx` (または新規エラーコンポーネント): localStorage エラー時のエラー表示 UI
- `tests/e2e/steps/common.steps.ts`: localStorage クリア処理を beforeEach フックに追加
- 新規ユニットテスト: `tests/unit/hooks/useTodos.localStorage.test.tsx`（localStorage 関連のテスト）

### Potential Risks

- **デグレリスク**: 既存の追加・削除・完了切り替え機能に影響を与える可能性（useEffect の依存配列ミス、無限ループなど）
- **テストの不安定性**: localStorage のモック処理が不十分だと、ユニットテストや E2E テストが不安定になる可能性
- **データ破損リスク**: JSON.parse エラー時の処理が不適切だと、ユーザーがアプリを使えなくなる可能性

## 5. Out of Scope (今回やらないこと)

- データマイグレーション機能（データ構造の変更に対する自動移行）
- 手動保存ボタンの実装（常にリアルタイム保存）
- 定期的な自動保存（一定間隔での保存）
- データのエクスポート/インポート機能
- データのバックアップ機能
- 複数デバイス間での同期
- サーバーサイドへのデータ保存

## 6. Verification Criteria (完了定義)

### 機能的な完了定義

- タスクを追加後、ブラウザをリロードしても、追加したタスクが表示されること
- タスクを削除後、ブラウザをリロードしても、削除されたタスクが表示されないこと
- タスクを完了状態に変更後、ブラウザをリロードしても、完了状態が保持されていること
- localStorage が使えない環境で、適切なエラーメッセージが表示されること
- localStorage のデータが破損している場合、エラーメッセージが表示され、空リストで再開できること

### 技術的な完了定義

- localStorage へのアクセスを抽象化した関数（`saveToLocalStorage`, `loadFromLocalStorage`）が実装されていること
- localStorage のキー名は `react-todo-app-tasks` であること
- データ形式は JSON 配列 `[{id: number, text: string, completed: boolean}, ...]` であること
- すべてのユニットテストがパスすること（既存 66 テスト + 新規テスト）
- すべての E2E テストがパスすること（既存 21 シナリオ + 新規シナリオ）
- ESLint チェックがパスすること
- プロダクションビルドが成功すること

### ドキュメント

- `spec/features/persist_tasks.feature` が作成されていること
- `KNOWLEDGE_BASE.md` に localStorage 実装のベストプラクティスが追加されていること
- `TODO.md` の Phase 9 タスクが完了としてマークされていること
