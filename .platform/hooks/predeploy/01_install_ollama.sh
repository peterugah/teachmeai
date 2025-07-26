#!/usr/bin/env bash
set -e

# -----------------------------------------------------------------------------
# Configuration: Log file and timestamp helper
# -----------------------------------------------------------------------------
LOG_FILE=/var/log/web.stdout.log

timestamp() {
  date '+%Y-%m-%d %H:%M:%S'
}

# -----------------------------------------------------------------------------
# Section 1: Remove any existing ’ollama’ binary
# -----------------------------------------------------------------------------
echo "[INFO] $(timestamp) Checking for existing ollama installation..." | tee -a "$LOG_FILE"

if command -v ollama >/dev/null 2>&1; then
  OL_PATH=$(command -v ollama)
  echo "[INFO] $(timestamp) Found ollama at $OL_PATH — removing…" | tee -a "$LOG_FILE"
  rm -f "$OL_PATH"
  echo "[INFO] $(timestamp) ollama removed." | tee -a "$LOG_FILE"
else
  echo "[INFO] $(timestamp) ollama not found; nothing to remove." | tee -a "$LOG_FILE"
fi

# -----------------------------------------------------------------------------
# Section 2: Install ollama
# -----------------------------------------------------------------------------
echo "[INFO] $(timestamp) Installing ollama…" | tee -a "$LOG_FILE"
/usr/bin/env bash -c "curl -fsSL https://ollama.com/install.sh | sh" 2>&1 | tee -a "$LOG_FILE"
echo "[INFO] $(timestamp) Installation complete." | tee -a "$LOG_FILE"

# -----------------------------------------------------------------------------
# Section 3: Pull required models
# -----------------------------------------------------------------------------
for model in mistral nomic-embed-text; do
  echo "[INFO] $(timestamp) Pulling model '${model}'…" | tee -a "$LOG_FILE"
  ollama pull "$model" 2>&1 | tee -a "$LOG_FILE"
  echo "[INFO] $(timestamp) Model '${model}' pulled successfully." | tee -a "$LOG_FILE"
done

# -----------------------------------------------------------------------------
# Section 4: Align & right‑size your context windows
# -----------------------------------------------------------------------------
EMBED_CTX_SIZE=2048       # matches nomic-embed-text’s trained max
CHAT_CTX_SIZE=4096        # only what you actually need for Mistral
echo "[INFO] $(timestamp) Aligning Ollama context windows:" \
     "embed=${EMBED_CTX_SIZE}, chat=${CHAT_CTX_SIZE}" | tee -a "$LOG_FILE"

# Ollama uses OLLAMA_CONTEXT_LENGTH for all runners; embed model will clamp to its 2K max
export OLLAMA_CONTEXT_LENGTH=${CHAT_CTX_SIZE}

# Log what Ollama will see if you query its CLI after startup
echo "[INFO] $(timestamp) After serve, the following 'ollama show' entries will confirm context lengths:" | tee -a "$LOG_FILE"
echo "[INFO] $(timestamp)   → nomic-embed-text: context_length should report ${EMBED_CTX_SIZE}" | tee -a "$LOG_FILE"
echo "[INFO] $(timestamp)   → mistral:            context_length should report <= ${CHAT_CTX_SIZE}" | tee -a "$LOG_FILE"

# -----------------------------------------------------------------------------
# Section 5: Ensure ’ollama serve’ is running
# -----------------------------------------------------------------------------
echo "[INFO] $(timestamp) Checking if ’ollama serve’ is already running…" | tee -a "$LOG_FILE"

if pgrep -f "ollama serve" >/dev/null 2>&1; then
  PID=$(pgrep -f "ollama serve" | head -n1)
  echo "[INFO] $(timestamp) ollama serve is active (PID ${PID})." | tee -a "$LOG_FILE"
else
  echo "[INFO] $(timestamp) ollama serve not running; starting now…" | tee -a "$LOG_FILE"
  nohup ollama serve >>"$LOG_FILE" 2>&1 &
  PID=$!
  echo "[INFO] $(timestamp) Started ollama serve (PID ${PID})." | tee -a "$LOG_FILE"
  # Give the service a moment to bind its port
  sleep 2
fi

# -----------------------------------------------------------------------------
# Section 6: Detect which port ’ollama serve’ is listening on
# -----------------------------------------------------------------------------
echo "[INFO] $(timestamp) Detecting ollama serve port…" | tee -a "$LOG_FILE"

if command -v ss >/dev/null 2>&1; then
  PORT=$(ss -tlnp 2>/dev/null \
    | grep "pid=${PID}" \
    | grep -oE ':[0-9]+' \
    | grep -oE '[0-9]+' \
    | head -n1)
elif command -v netstat >/dev/null 2>&1; then
  PORT=$(netstat -tlnp 2>/dev/null \
    | grep "${PID}" \
    | grep -oE ':[0-9]+' \
    | grep -oE '[0-9]+' \
    | head -n1)
else
  PORT="unknown"
fi

echo "[INFO] $(timestamp) ollama serve is listening on port ${PORT}." | tee -a "$LOG_FILE"

# -----------------------------------------------------------------------------
# Section 7: Finalization
# -----------------------------------------------------------------------------
echo "[INFO] $(timestamp) All steps completed successfully." | tee -a "$LOG_FILE"
