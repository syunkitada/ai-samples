#!/bin/bash

opencode --model opencode/grok-code run --format json --log-level DEBUG "$(cat ./prompt.md)" >result.json
