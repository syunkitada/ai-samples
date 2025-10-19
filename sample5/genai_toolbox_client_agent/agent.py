# ./adk_agent_samples/mcp_client_agent/agent.py
from google.adk.agents import LlmAgent
from google.adk.tools.mcp_tool.mcp_session_manager import \
    StreamableHTTPConnectionParams
from google.adk.tools.mcp_tool.mcp_toolset import MCPToolset

mcp_tool = MCPToolset(
    connection_params=StreamableHTTPConnectionParams(
        url="http://127.0.0.1:5000/mcp",
    ),
    tool_filter=None,
)

root_agent = LlmAgent(
    model="gemini-2.0-flash",
    name="instance_searcher_mcp_client_agent",
    description="An agent that helps users find instances by name.",
    instruction="You are a helpful assistant. If the user asks about instances or host, "
    "you should use the appropriate tool from the toolbox. "
    "Otherwise, answer with your general knowledge.",
    tools=[mcp_tool],
)
