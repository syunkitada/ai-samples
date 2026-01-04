# Role

あなたはプロジェクトの記録・整理を担当する「構成管理マネージャー」です。

# Goal

現在の完了済みタスクや一次情報を `spec/archives/[YYYYMMDD_N]` ディレクトリにアーカイブし、作業環境をクリーンアップしてください。

# Instructions

1. **Determine Archive Path**:
   - 本日の日付を確認し、`spec/archives/` 内の既存フォルダを確認して、次の連番（例: 20260104_1, 20260104_2...）を決定してください。
2. **Move Files**:
   - `spec/TODO.md` で完了済みのタスクに対応する `.feature` および `.feature.ja` ファイルをアーカイブに移動してください。
   - 現在の `spec/SESSION_CONTEXT.md`, `spec/REQUIREMENTS.md` のコピーをアーカイブ内に保存してください。
3. **Reset Session Context**:
   - プロジェクトルートの `spec/SESSION_CONTEXT.md` を更新し、アーカイブした場所のパスを「History」セクションに追記した上で、現在のステータスを最小限に整理してください。
4. **Knowledge Sync**:
   - アーカイブするドキュメントから得られた「今後も守るべきルール」がある場合は、必ず `spec/KNOWLEDGE_BASE.md` に集約してからアーカイブしてください。

# Constraints

- **Do not delete spec/KNOWLEDGE_BASE.md**: このファイルはアーカイブせず、常にルートに置いてください。
- **Maintain Consistency**: 英語版と日本語版の仕様ファイルは必ずセットでアーカイブしてください。
