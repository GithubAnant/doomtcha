#!/bin/bash
# Run Doom WASM locally

cd "$(dirname "$0")/public"
echo "Starting server at http://localhost:8000/wasm/wasm-doom.html"
echo "Press Ctrl+C to stop"
python3 -m http.server 8000
