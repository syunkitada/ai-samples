# sample2

- API, CLIのチャットボットサンプルです。

```
$ uv sync
```

```
export OPENAI_BASE_URL=https://openrouter.ai/api/v1
export OPENAI_API_KEY=xxx
```

```
$ uv run uvicorn api:app --reload --port 8000
INFO:     Will watch for changes in these directories: ['/home/owner/tmp/ai-samples/sample2']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [1123649] using StatReload
INFO:     Started server process [1123651]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     127.0.0.1:52348 - "POST /chat HTTP/1.1" 200 OK
...
```

```
$ uv run cli.py
You: hello
Bot: Hello! How can I help you today?
You:
```
