# sample3

Google Agent Development Kit を使ったサンプルコードです。

https://google.github.io/adk-docs/get-started/quickstart/

```
$ uv sync
```

```
$ uv run adk run multi_tool_agent
```

```
$ uv run adk run multi_tool_agent
Log setup complete: /tmp/agents_log/agent.20250928_211303.log
To access latest log: tail -F /tmp/agents_log/agent.latest.log
/home/owner/tmp/ai-samples/sample3/.venv/lib/python3.12/site-packages/google/adk/cli/cli.py:154: UserWarning: [EXPERIMENTAL] InMemoryCredentialService: This feature is experimental and may change or be removed in future versions without notice. It may introduce breaking changes at any time.
  credential_service = InMemoryCredentialService()
/home/owner/tmp/ai-samples/sample3/.venv/lib/python3.12/site-packages/google/adk/auth/credential_service/in_memory_credential_service.py:33: UserWarning: [EXPERIMENTAL] BaseCredentialService: This feature is experimental and may change or be removed in future versions without notice. It may introduce breaking changes at any time.
  super().__init__()
Running agent weather_time_agent, type exit to exit.
/home/owner/tmp/ai-samples/sample3/.venv/lib/python3.12/site-packages/google/adk/cli/cli.py:98: UserWarning: [EXPERIMENTAL] App: This feature is experimental and may change or be removed in future versions without notice. It may introduce breaking changes at any time.
  else App(name=session.app_name, root_agent=root_agent_or_app)
[user]: hello
[weather_time_agent]: Hello! How can I help you today?

[user]: new york
[weather_time_agent]: OK. The weather in New York is sunny with a temperature of 25 degrees Celsius (77 degrees Fahrenheit). The current time in New York is 2025-09-28 08:13:16 EDT-0400. Anything else?
```
