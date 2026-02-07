#!/usr/bin/env python3

import json


def analyze_result_json(file_path):
    event_counts = {}
    texts = []
    step_times = []
    step_start_times = {}
    step_finish_stats = {
        "cost": [],
        "tokens_input": [],
        "tokens_output": [],
        "tokens_reasoning": [],
        "tokens_cache_read": [],
        "tokens_cache_write": [],
    }

    with open(file_path, "r", encoding="utf-8") as file:
        for line in file:
            line = line.strip()
            if line:
                try:
                    data = json.loads(line)
                    event_type = data.get("type")
                    if event_type:
                        event_counts[event_type] = event_counts.get(event_type, 0) + 1

                    # Collect text parts for analysis
                    if event_type == "text" and "text" in data.get("part", {}):
                        texts.append(data["part"]["text"])

                    # Track step_start and step_finish for elapsed time
                    if event_type == "step_start":
                        session_id = data.get("sessionID")
                        timestamp = data.get("timestamp")
                        if session_id and timestamp:
                            step_start_times[session_id] = timestamp
                    if event_type == "step_finish":
                        session_id = data.get("sessionID")
                        timestamp = data.get("timestamp")
                        if session_id and timestamp and session_id in step_start_times:
                            elapsed = timestamp - step_start_times[session_id]
                            step_times.append((session_id, elapsed))
                        # Collect cost/tokens stats
                        part = data.get("part", {})
                        cost = part.get("cost")
                        tokens = part.get("tokens", {})
                        if cost is not None:
                            step_finish_stats["cost"].append(cost)
                        if tokens:
                            step_finish_stats["tokens_input"].append(
                                tokens.get("input", 0)
                            )
                            step_finish_stats["tokens_output"].append(
                                tokens.get("output", 0)
                            )
                            step_finish_stats["tokens_reasoning"].append(
                                tokens.get("reasoning", 0)
                            )
                            cache = tokens.get("cache", {})
                            step_finish_stats["tokens_cache_read"].append(
                                cache.get("read", 0)
                            )
                            step_finish_stats["tokens_cache_write"].append(
                                cache.get("write", 0)
                            )
                except json.JSONDecodeError as e:
                    print(f"Error parsing line: {e}")

    print("Event Type Counts:")
    for event_type, count in event_counts.items():
        print(f"{event_type}: {count}")

    print("\nCollected Texts:")
    print("-" * 200)
    for text in texts:
        print(text)
    print("-" * 200)

    print("\nStep Elapsed Times:")
    for session_id, elapsed in step_times:
        print(f"Session {session_id}: {elapsed/1000:.3f} sec")

    def print_stats(label, values):
        if not values:
            print(f"{label}: No data")
            return
        print(
            f"{label}: sum={sum(values)}, avg={sum(values)/len(values):.2f}, max={max(values)}, min={min(values)}"
        )

    print("\nStep Finish Statistics:")
    print_stats("Cost", step_finish_stats["cost"])
    print_stats("Tokens Input", step_finish_stats["tokens_input"])
    print_stats("Tokens Output", step_finish_stats["tokens_output"])
    print_stats("Tokens Reasoning", step_finish_stats["tokens_reasoning"])
    print_stats("Tokens Cache Read", step_finish_stats["tokens_cache_read"])
    print_stats("Tokens Cache Write", step_finish_stats["tokens_cache_write"])


# Run analysis on result.json
analyze_result_json("./result.json")
