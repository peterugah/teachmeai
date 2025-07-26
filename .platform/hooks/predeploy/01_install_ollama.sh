#!/usr/bin/env bash
set -e

# write logs into the existing web.stdout.log
LOG_FILE=/var/log/web.stdout.log

# ----------------------------------------------------------------------------
# Performance Tuning for CPU Inference
# ----------------------------------------------------------------------------
# Use all available vCPUs, pin threads to cores, and enable memory-mapping
export OMP_NUM_THREADS=16
export KMP_AFFINITY="granularity=fine,compact,1,0"
export GGML_USE_MMAP=1

# Utility for timestamped logs
timestamp() {
  date '+%Y-%m-%d %H:%M:%S'
}

# ----------------------------------------------------------------------------
# Install or Reinstall Ollama
# ----------------------------------------------------------------------------
echo "[INFO] $(timestamp) Checking if ollama is installed..." | tee -a "$LOG_FILE"

if command -v ollama >/dev/null 2>&1; then
  OL_PATH=$(command -v ollama)
  echo "[INFO] $(timestamp) Found ollama at $OL_PATH. Removing..." | tee -a "$LOG_FILE"
  rm -f "$OL_PATH"
  echo "[INFO] $(timestamp) ollama removed." | tee -a "$LOG_FILE"
else
  echo "[INFO] $(timestamp) ollama not currently installed." | tee -a "$LOG_FILE"
fi

echo "[INFO] $(timestamp) Installing ollama..." | tee -a "$LOG_FILE"
/usr/bin/env bash -c "curl -fsSL https://ollama.com/install.sh | sh" 2>&1 | tee -a "$LOG_FILE"
echo "[INFO] $(timestamp) ollama installation complete." | tee -a "$LOG_FILE"

# ----------------------------------------------------------------------------
# Pull Required Models
# ----------------------------------------------------------------------------
for model in mistral nomic-embed-text; do
  echo "[INFO] $(timestamp) Pulling model '$model'..." | tee -a "$LOG_FILE"
  ollama pull "$model" 2>&1 | tee -a "$LOG_FILE"
  echo "[INFO] $(timestamp) Model '$model' pulled successfully." | tee -a "$LOG_FILE"
done

# ----------------------------------------------------------------------------
# Ensure Ollama Serve is Running with Optimized Flags
# ----------------------------------------------------------------------------
echo "[INFO] $(timestamp) Checking if ollama serve is already running..." | tee -a "$LOG_FILE"
if pgrep -f "ollama serve" >/dev/null 2>&1; then
  PID=$(pgrep -f "ollama serve" | head -n1)
  echo "[INFO] $(timestamp) ollama serve is already running (PID $PID)." | tee -a "$LOG_FILE"
else
  echo "[INFO] $(timestamp) ollama serve not running. Starting ollama serve with optimized flags..." | tee -a "$LOG_FILE"
  # Pin to cores 0-15, use full threads, batch, context size, and mmap
taskset -c 0-15 nohup ollama serve --threads 16 --batch-size 128 --ctx-size 4096 >>"$LOG_FILE" 2>&1 &
  PID=$!
  echo "[INFO] $(timestamp) Started ollama serve (PID $PID) with performance flags." | tee -a "$LOG_FILE"
  sleep 2
fi

# ----------------------------------------------------------------------------
# Detect Listening Port for Ollama Serve
# ----------------------------------------------------------------------------
echo "[INFO] $(timestamp) Detecting ollama serve port..." | tee -a "$LOG_FILE"
if command -v ss >/dev/null 2>&1; then
  PORT=$(ss -tlnp 2>/dev/null \
    | grep "pid=$PID" \
    | grep -oE ':[0-9]+' \
    | grep -oE '[0-9]+' \
    | head -n1)
elif command -v netstat >/dev/null 2>&1; then
  PORT=$(netstat -tlnp 2>/dev/null \
    | grep "$PID" \
    | grep -oE ':[0-9]+' \
    | grep -oE '[0-9]+' \
    | head -n1)
else
  PORT="unknown"
fi

echo "[INFO] $(timestamp) ollama serve is listening on port ${PORT}." | tee -a "$LOG_FILE"

echo "[INFO] $(timestamp) All done." | tee -a "$LOG_FILE"
