# agent-team

- 以下の資料を読み進めながら実装したものです。
- [Google ADK: agent-team](https://google.github.io/adk-docs/tutorials/agent-team/)
  - この資料は、Agent Development Kit (ADK) という Python フレームワークを使用して、高度な大規模言語モデル (LLM) エージェントチームを構築するための詳細なチュートリアルです。
  - 基本的なエージェントの作成から始まり、LiteLLM との統合によるマルチモデル対応（Gemini、GPT、Claude など）の実現、専門エージェントへの自動委任を通じたチーム構築、セッションステートを活用したパーソナライゼーションとメモリの実装へと段階的に進みます。
  - 最後に、コールバック（before_model_callback と before_tool_callback）を用いて、入力のフィルタリングやツールの引数チェックといった重要な安全ガードレールを組み込む方法が解説されています。

## 使い方

```
export GOOGLE_API_KEY="xxx"
export GOOGLE_GENAI_USE_VERTEXAI="False"
```

```
$ uv sync
$ uv run -m agent_team.agent
```
