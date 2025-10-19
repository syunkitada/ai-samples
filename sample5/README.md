# sample5

[Google ADK: Model Context Protocol Tools](https://google.github.io/adk-docs/tools/mcp-tools/)

## file_system_mcp_agent

```
$ uv run adk web --host 0.0.0.0 --port 8000 --allow_origins '*'
```

```
< What are the files in my "mcp_agent" folder?
> OK. The files in your "mcp_agent" folder are: init.py, agent.py and a directory called pycache.
```

## genai_toolbox

```
$ cd genai_toolbox
$ docker compose up -d

$ cd -
$ uv run adk run .
...
[user]: Search testvm and show the information
[instance_searcher_mcp_client_agent]: Here is the information for the VM instance named testvm: its availability zone is nova, it is running on host openstack-allinone, its image ref is 15c6ec17-4feb-403f-a6d0-2ecad28d9b01, its project id is 06e53e445a8c45f89d17c13559c918f1, its uuid is d7e028d7-2712-469b-b521-f78fa55cf015, its memory is 512 MB, and it has 1 VCPU.
```
