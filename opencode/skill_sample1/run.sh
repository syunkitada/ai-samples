#!/bin/bash -xe

opencode run --format json --log-level DEBUG "$(cat ./prompt.md)" >result.json
