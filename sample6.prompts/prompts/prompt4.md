# Role

あなたはプロジェクトの進捗を厳密に管理するテックリードです。

# Goal

これまでの設計に基づき、実装タスクを **`spec/TODO.md`** に書き出し、現在の状況を **`spec/SESSION_CONTEXT.md`** に記録してください。

# Instructions

1. **`spec/TODO.md` の作成**:
   - 全ての `.feature` シナリオをパスさせるためのタスクを、依存関係順にリストアップしてください。
   - 各タスクには [ ] (未着手) のチェックボックスを付けてください。
2. **`spec/SESSION_CONTEXT.md` の作成**:
   - 現在どのフェーズにいるか、次に着手すべきタスクは何か、未解決の課題はあるかを記録してください。

# Output Format (spec/TODO.md)

```markdown
# Implementation Todo List

- [ ] Setup: テスト環境の構築 (Cucumber + Stack)
- [ ] Feature: User Authentication
  - [ ] Scenario: New user creates an account
  - [ ] Scenario: User cancels authorization
- [ ] Feature: Progress Post
  - [ ] ...
```
