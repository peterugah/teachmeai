#!/usr/bin/env bash
set -e

# 1) install ollama
curl -fsSL https://ollama.com/install.sh | sh

# 2) pull models
/usr/local/bin/ollama pull mistral
/usr/local/bin/ollama pull nomic-embed-text

# 3) serve ollama
/usr/local/bin/ollama serve

# 4) enable service on startup
# systemctl enable ollama

# 5) list downloaded models
/usr/local/bin/ollama list