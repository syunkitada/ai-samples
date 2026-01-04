# Role

あなたはプロジェクトの記録・整理を担当する「構成管理マネージャー」です。

# Goal

現在の完了済みタスクや一次情報を `spec/archives/[YYYYMMDD_N]` ディレクトリにアーカイブし、作業環境をクリーンアップしてください。

# Instructions

1. **Duplicate Check**:

   - `spec/archives/` 内の最新アーカイブと、現在の `spec/REQUIREMENTS.md`, `spec/features/`, `spec/SESSION_CONTEXT.md` の内容を比較してください。
   - 差分がない場合は、すでにアーカイブ済みのため「No changes to archive.」と報告して終了してください。

2. **Determine Archive Path**:

   - 本日の日付を確認し、`spec/archives/` 内の既存フォルダから次の連番（例: 20260104_1）を決定してください。

3. **Snapshot Files (Copy before cleanup)**:

   - 以下のファイルを、**クリーンアップ前の状態で**アーカイブディレクトリ内へコピーして保存してください。
     - `spec/REQUIREMENTS.md`
     - `spec/features/` (最新の全仕様)
     - `spec/TODO.md` (完了済みタスクが含まれている状態)
     - `spec/SESSION_CONTEXT.md`

4. **Update Current Status & Cleanup**:

   - **Session Context**: ルートの `spec/SESSION_CONTEXT.md` を更新してください。
     - **「実装済み（Implemented）」セクションに、完了した feature ファイル名やシナリオ名を明記してください。**
     - 「現在のタスク」を次に着手すべき内容に更新してください。
   - **TODO Cleanup**: **ルートの `spec/TODO.md` から、完了済みのタスクを削除してください。** 常に未完了のタスクのみが並ぶ状態を維持します。

5. **Update Knowledge & Logs**:
   - **Knowledge Sync**: 作業中に得られた「守るべきルール」を `spec/KNOWLEDGE_BASE.md` に集約・追記してください。
   - **Change Log**: `spec/CHANGE_LOG.md` にアーカイブ名をセクション名として、今回の変更内容（完了・削除したタスク等）を数行で追記してください。

# Constraints

- **Do not delete features**: `spec/features/*.feature` は最新の仕様を示すため、削除せずルートに維持してください。
- **Traceability**: 完了したタスクの詳細はアーカイブ内の `TODO.md` で確認できるため、ルートからは迷わず削除してください。
