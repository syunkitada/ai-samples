# sample3

- 以下の資料の Google Agent Development Kit のサンプルコードです。
- [Google ADK: quickstart](https://google.github.io/adk-docs/get-started/quickstart/)

## 使い方

```
export GOOGLE_API_KEY="xxx"
export GOOGLE_GENAI_USE_VERTEXAI="False"
```

```
$ uv sync

$ uv run adk run multi_tool_agent
or
$ uv run adk web --host 0.0.0.0 --port 8000 --allow_origins '*'
```

以下をプロンプトに入力してみる。

```
What time in London?
> I am sorry, I don't have timezone information for London.

What time in new york?
> The current time in New York is 2025-10-12 06:29:56 EDT-0400.

What weather in new york?
> The weather in New York is sunny with a temperature of 25 degrees Celsius (77 degrees Fahrenheit).
```
