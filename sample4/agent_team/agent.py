# @title Import necessary libraries
import asyncio
import os
import warnings
import logging

from google.adk.agents import Agent
from google.adk.models.lite_llm import LiteLlm  # For multi-model support
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types  # For creating message Content/Parts

from .tools.weather import get_weather, get_weather_stateful  # Import the weather tool
from .tools.greeting import say_hello, say_goodbye  # Import greeting tools
from .callbacks.before_llm import (
    block_keyword_guardrail,
)  # Import the guardrail callback
from .callbacks.before_tool import (
    block_paris_tool_guardrail,
)  # Import the tool guardrail callback

# Ignore all warnings
warnings.filterwarnings("ignore")

logging.basicConfig(level=logging.ERROR)

print("Libraries imported.")


# --- Define Model Constants for easier use ---

# More supported models can be referenced here: https://ai.google.dev/gemini-api/docs/models#model-variations
MODEL_GEMINI_2_0_FLASH = "gemini-2.0-flash"

# More supported models can be referenced here: https://docs.litellm.ai/docs/providers/openai#openai-chat-completion-models
MODEL_GPT_4O = "openai/gpt-4.1"  # You can also try: gpt-4.1-mini, gpt-4o etc.

# More supported models can be referenced here: https://docs.litellm.ai/docs/providers/anthropic
MODEL_CLAUDE_SONNET = "anthropic/claude-sonnet-4-20250514"  # You can also try: claude-opus-4-20250514 , claude-3-7-sonnet-20250219 etc

print("\nEnvironment configured.")

# @title Define the Weather Agent
# Use one of the model constants defined earlier
AGENT_MODEL = MODEL_GEMINI_2_0_FLASH  # Starting with Gemini

# @title Define Greeting and Farewell Sub-Agents

# If you want to use models other than Gemini, Ensure LiteLlm is imported and API keys are set (from Step 0/2)
# from google.adk.models.lite_llm import LiteLlm
# MODEL_GPT_4O, MODEL_CLAUDE_SONNET etc. should be defined
# Or else, continue to use: model = MODEL_GEMINI_2_0_FLASH

# --- Greeting Agent ---
greeting_agent = None
try:
    greeting_agent = Agent(
        # Using a potentially different/cheaper model for a simple task
        model=MODEL_GEMINI_2_0_FLASH,
        # model=LiteLlm(model=MODEL_GPT_4O), # If you would like to experiment with other models
        name="greeting_agent",
        instruction="You are the Greeting Agent. Your ONLY task is to provide a friendly greeting to the user. "
        "Use the 'say_hello' tool to generate the greeting. "
        "If the user provides their name, make sure to pass it to the tool. "
        "Do not engage in any other conversation or tasks.",
        description="Handles simple greetings and hellos using the 'say_hello' tool.",  # Crucial for delegation
        tools=[say_hello],
    )
    print(
        f"✅ Agent '{greeting_agent.name}' created using model '{greeting_agent.model}'."
    )
except Exception as e:
    print(
        f"❌ Could not create Greeting agent. Check API Key ({greeting_agent.model}). Error: {e}"
    )

# --- Farewell Agent ---
farewell_agent = None
try:
    farewell_agent = Agent(
        # Can use the same or a different model
        model=MODEL_GEMINI_2_0_FLASH,
        # model=LiteLlm(model=MODEL_GPT_4O), # If you would like to experiment with other models
        name="farewell_agent",
        instruction="You are the Farewell Agent. Your ONLY task is to provide a polite goodbye message. "
        "Use the 'say_goodbye' tool when the user indicates they are leaving or ending the conversation "
        "(e.g., using words like 'bye', 'goodbye', 'thanks bye', 'see you'). "
        "Do not perform any other actions.",
        description="Handles simple farewells and goodbyes using the 'say_goodbye' tool.",  # Crucial for delegation
        tools=[say_goodbye],
    )
    print(
        f"✅ Agent '{farewell_agent.name}' created using model '{farewell_agent.model}'."
    )
except Exception as e:
    print(
        f"❌ Could not create Farewell agent. Check API Key ({farewell_agent.model}). Error: {e}"
    )

# @title Define the Root Agent with Sub-Agents

# Ensure sub-agents were created successfully before defining the root agent.
# Also ensure the original 'get_weather' tool is defined.
root_agent = None
runner_root = None  # Initialize runner

if greeting_agent and farewell_agent and "get_weather" in globals():
    # Let's use a capable Gemini model for the root agent to handle orchestration
    root_agent_model = MODEL_GEMINI_2_0_FLASH

    weather_agent_team = Agent(
        name="weather_agent_v2",  # Give it a new version name
        model=root_agent_model,
        description="Main agent: Provides weather (state-aware unit), delegates greetings/farewells, saves report to state.",
        instruction="You are the main Weather Agent. Your job is to provide weather using 'get_weather_stateful'. "
        "The tool will format the temperature based on user preference stored in state. "
        "Delegate simple greetings to 'greeting_agent' and farewells to 'farewell_agent'. "
        "Handle only weather requests, greetings, and farewells.",
        tools=[
            get_weather_stateful,
        ],  # Root agent still needs the weather tool for its core task
        # Key change: Link the sub-agents here!
        sub_agents=[greeting_agent, farewell_agent],
        output_key="last_weather_report",  # Save last report to state
        before_model_callback=block_keyword_guardrail,  # Attach the guardrail callback
        before_tool_callback=block_paris_tool_guardrail,  # Attach the tool guardrail callback
    )
    print(
        f"✅ Root Agent '{weather_agent_team.name}' created using model '{root_agent_model}' with sub-agents: {[sa.name for sa in weather_agent_team.sub_agents]}"
    )

else:
    print(
        "❌ Cannot create root agent because one or more sub-agents failed to initialize or 'get_weather' tool is missing."
    )
    if not greeting_agent:
        print(" - Greeting Agent is missing.")
    if not farewell_agent:
        print(" - Farewell Agent is missing.")
    if "get_weather" not in globals():
        print(" - get_weather function is missing.")

# @title Define Agent Interaction Function

from google.genai import types  # For creating message Content/Parts


async def call_agent_async(query: str, runner, user_id, session_id):
    """Sends a query to the agent and prints the final response."""
    print(f"\n>>> User Query: {query}")

    # Prepare the user's message in ADK format
    content = types.Content(role="user", parts=[types.Part(text=query)])

    final_response_text = "Agent did not produce a final response."  # Default

    # Key Concept: run_async executes the agent logic and yields Events.
    # We iterate through events to find the final answer.
    async for event in runner.run_async(
        user_id=user_id, session_id=session_id, new_message=content
    ):
        # You can uncomment the line below to see *all* events during execution
        # print(f"  [Event] Author: {event.author}, Type: {type(event).__name__}, Final: {event.is_final_response()}, Content: {event.content}")

        # Key Concept: is_final_response() marks the concluding message for the turn.
        if event.is_final_response():
            if event.content and event.content.parts:
                # Assuming text response in the first part
                final_response_text = event.content.parts[0].text
            elif (
                event.actions and event.actions.escalate
            ):  # Handle potential errors/escalations
                final_response_text = (
                    f"Agent escalated: {event.error_message or 'No specific message.'}"
                )
            # Add more checks here if needed (e.g., specific error codes)
            break  # Stop processing events once the final response is found

    print(f"<<< Agent Response: {final_response_text}")


# @title Setup Session Service and Runner

# @title Run the Initial Conversation

# Ensure the root agent (e.g., 'weather_agent_team' or 'root_agent' from the previous cell) is defined.
# Ensure the call_agent_async function is defined.

# Check if the root agent variable exists before defining the conversation function
root_agent_var_name = "root_agent"  # Default name from Step 3 guide
if "weather_agent_team" in globals():  # Check if user used this name instead
    root_agent_var_name = "weather_agent_team"
elif "root_agent" not in globals():
    print(
        "⚠️ Root agent ('root_agent' or 'weather_agent_team') not found. Cannot define run_team_conversation."
    )
    # Assign a dummy value to prevent NameError later if the code block runs anyway
    root_agent = None  # Or set a flag to prevent execution


# @title Setup Session Service and Runner

# --- Session Management ---
# Key Concept: SessionService stores conversation history & state.
# InMemorySessionService is simple, non-persistent storage for this tutorial.
session_service = InMemorySessionService()

# Define constants for identifying the interaction context
APP_NAME = "weather_tutorial_app"
USER_ID = "user_1"
SESSION_ID = "session_001"  # Using a fixed ID for simplicity

# Define initial state data - user prefers Celsius initially
initial_state = {"user_preference_temperature_unit": "Celsius"}

# Create the specific session where the conversation will happen
session = asyncio.run(
    session_service.create_session(
        app_name=APP_NAME,
        user_id=USER_ID,
        session_id=SESSION_ID,
        state=initial_state,
    )
)
print(f"Session created: App='{APP_NAME}', User='{USER_ID}', Session='{SESSION_ID}'")

# --- Runner ---
# Key Concept: Runner orchestrates the agent execution loop.
actual_root_agent = globals()[root_agent_var_name]
runner = Runner(
    agent=actual_root_agent,  # The agent we want to run
    app_name=APP_NAME,  # Associates runs with our app
    session_service=session_service,  # Uses our session manager
)
print(f"Runner created for agent '{runner.agent.name}'.")


async def run_team_conversation():
    print("\n--- Testing Agent Team Delegation ---")

    # Use the runner for the agent with the callback and the existing stateful session ID
    # Define a helper lambda for cleaner interaction calls
    interaction_func = lambda query: call_agent_async(
        query, runner=runner, user_id=USER_ID, session_id=SESSION_ID
    )

    # --- Interactions using await (correct within async def) ---
    await interaction_func("Hello there!")  # Greeting (Delegated)

    # 1. Check weather (Uses initial state: Celsius)
    print("--- Turn 1: Requesting weather in London (expect Celsius) ---")
    await interaction_func("What's the weather in London?")

    print("\n--- Turn 2: Requesting with blocked keyword (expect blocked) ---")
    await interaction_func(
        "BLOCK the request for weather in Tokyo"
    )  # Callback should catch "BLOCK"

    # 2. Blocked city (Should pass model callback, but be blocked by tool callback)
    print(
        "\n--- Turn 2: Requesting weather in Paris (expect blocked by tool guardrail) ---"
    )
    await interaction_func("How about Paris?")  # Tool callback should intercept this

    # 2. Manually update state preference to Fahrenheit - DIRECTLY MODIFY STORAGE
    print("\n--- Manually Updating State: Setting unit to Fahrenheit ---")
    try:
        # Access the internal storage directly - THIS IS SPECIFIC TO InMemorySessionService for testing
        # NOTE: In production with persistent services (Database, VertexAI), you would
        # typically update state via agent actions or specific service APIs if available,
        # not by direct manipulation of internal storage.
        stored_session = session_service.sessions[APP_NAME][USER_ID][SESSION_ID]
        stored_session.state["user_preference_temperature_unit"] = "Fahrenheit"
        # Optional: You might want to update the timestamp as well if any logic depends on it
        # import time
        # stored_session.last_update_time = time.time()
        print(
            f"--- Stored session state updated. Current 'user_preference_temperature_unit': {stored_session.state.get('user_preference_temperature_unit', 'Not Set')} ---"
        )  # Added .get for safety
    except KeyError:
        print(
            f"--- Error: Could not retrieve session '{SESSION_ID}' from internal storage for user '{USER_ID}' in app '{APP_NAME}' to update state. Check IDs and if session was created. ---"
        )
    except Exception as e:
        print(f"--- Error updating internal session state: {e} ---")

    # 3. Check weather again (Tool should now use Fahrenheit)
    # This will also update 'last_weather_report' via output_key
    print("\n--- Turn 2: Requesting weather in New York (expect Fahrenheit) ---")
    await interaction_func("Tell me the weather in New York.")

    # 4. Test basic delegation (should still work)
    # This will update 'last_weather_report' again, overwriting the NY weather report
    print("\n--- Turn 3: Sending a greeting ---")
    await interaction_func("Hi!")

    # await call_agent_async(
    #     query="Thanks, bye!",
    #     runner=runner,
    #     user_id=USER_ID,
    #     session_id=SESSION_ID,
    # )


# --- Execute the `run_team_conversation` async function ---
# Choose ONE of the methods below based on your environment.
# Note: This may require API keys for the models used!

if __name__ == "__main__":  # Ensures this runs only when script is executed directly
    print("Executing using 'asyncio.run()' (for standard Python scripts)...")
    try:
        # This creates an event loop, runs your async function, and closes the loop.
        asyncio.run(run_team_conversation())

        # --- Inspect final session state after the conversation ---
        # This block runs after either execution method completes.
        print("\n--- Inspecting Final Session State ---")
        final_session = asyncio.run(
            session_service.get_session(
                app_name=APP_NAME, user_id=USER_ID, session_id=SESSION_ID
            )
        )
        if final_session:
            # Use .get() for safer access to potentially missing keys
            print(
                f"Final Preference: {final_session.state.get('user_preference_temperature_unit', 'Not Set')}"
            )
            print(
                f"Final Last Weather Report (from output_key): {final_session.state.get('last_weather_report', 'Not Set')}"
            )
            print(
                f"Final Last City Checked (by tool): {final_session.state.get('last_city_checked_stateful', 'Not Set')}"
            )
            # Print full state for detailed view
            # print(f"Full State Dict: {final_session.state}") # For detailed view
        else:
            print("\n❌ Error: Could not retrieve final session state.")

    except Exception as e:
        print(f"An error occurred: {e}")
