#!/usr/bin/env bash
set -e

# write logs into the existing web.stdout.log
LOG_FILE=/var/log/web.stdout.log

# ----------------------------------------------------------------------------
# Performance Tuning for CPU Inference (Baseline)
# ----------------------------------------------------------------------------
# Detect total vCPUs and approximate physical cores (half)
TOTAL_VCPU=$(nproc)
PHYS_CORES=$((TOTAL_VCPU/2))
# Allow override of threads, batch & context via env vars
THREADS=${OLLAMA_THREADS:-$PHYS_CORES}
BATCH_SIZE=${OLLAMA_BATCH:-8}
CTX_SIZE=${OLLAMA_CTX:-2048}

# Export reduced threading (physical cores) and disable aggressive mmap
export OMP_NUM_THREADS=$THREADS
# Disable affinity overrides for stability
# export KMP_AFFINITY="none"
# Disable mmap to test direct RAM access
export GGML_USE_MMAP=0

# logging performance settings
timestamp() { date '+%Y-%m-%d %H:%M:%S'; }
echo "[INFO] $(timestamp) Performance settings: threads=$THREADS, batch_size=$BATCH_SIZE, ctx_size=$CTX_SIZE, mmap=$GGML_USE_MMAP" | tee -a "$LOG_FILE"

echo "[INFO] $(timestamp) OMP_NUM_THREADS=$OMP_NUM_THREADS" | tee -a "$LOG_FILE"

# ----------------------------------------------------------------------------
# Install or Reinstall Ollama
# ----------------------------------------------------------------------------
echo "[INFO] $(timestamp) Checking if ollama is installed..." | tee -a "$LOG_FILE"
if command -v ollama >/dev/null 2>&1; then
  rm -f "$(command -v ollama)"
  echo "[INFO] $(timestamp) Removed existing ollama." | tee -a "$LOG_FILE"
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
done

# ----------------------------------------------------------------------------
# Ensure Ollama Serve is Running with Baseline Config
# ----------------------------------------------------------------------------
EXISTING_PID=$(pgrep -f "ollama serve" | head -n1 || true)
if [ -n "$EXISTING_PID" ]; then
  echo "[INFO] $(timestamp) Killing existing serve (PID $EXISTING_PID)" | tee -a "$LOG_FILE"
  kill "$EXISTING_PID" || true
  sleep 2
fi

echo "[INFO] $(timestamp) Starting ollama serve..." | tee -a "$LOG_FILE"
nohup ollama serve \
  --threads "$THREADS" \
  --batch-size "$BATCH_SIZE" \
  --ctx-size "$CTX_SIZE" \
  >>"$LOG_FILE" 2>&1 &
PID=$!
echo "[INFO] $(timestamp) Started serve (PID $PID) with threads=$THREADS, batch=$BATCH_SIZE, ctx=$CTX_SIZE." | tee -a "$LOG_FILE"
sleep 2

# ----------------------------------------------------------------------------
# Detect Serve Port & Warm-up
# ----------------------------------------------------------------------------
PORT=$(ss -tlnp 2>/dev/null | grep "pid=$PID" | grep -oE ':[0-9]+' | tr -d ':' | head -n1 || echo 11434)
echo "[INFO] $(timestamp) Serve listening on port $PORT" | tee -a "$LOG_FILE"
if command -v curl >/dev/null 2>&1; then
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:$PORT/v1/models")
  echo "[INFO] $(timestamp) Warm-up HTTP code: $CODE" | tee -a "$LOG_FILE"
fi

echo "[INFO] $(timestamp) Done." | tee -a "$LOG_FILE"
