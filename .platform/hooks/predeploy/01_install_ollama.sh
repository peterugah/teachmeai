#!/usr/bin/env bash
set -e

# write logs into the existing web.stdout.log
LOG_FILE=/var/log/web.stdout.log

# ----------------------------------------------------------------------------
# Performance Tuning for CPU Inference
# ----------------------------------------------------------------------------
# Detect CPU count and allow override of batch & context via env vars
NPROC=$(nproc)
BATCH_SIZE=${OLLAMA_BATCH:-128}
CTX_SIZE=${OLLAMA_CTX:-4096}

export OMP_NUM_THREADS=$NPROC
export KMP_AFFINITY="granularity=fine,compact,1,0"
export GOMP_BLOCKTIME=1
export GOMP_CPU_AFFINITY="0-$((NPROC-1))"
export GGML_USE_MMAP=1

# logging performance settings
timestamp() { date '+%Y-%m-%d %H:%M:%S'; }
echo "[INFO] $(timestamp) Performance settings: threads=$NPROC, batch_size=$BATCH_SIZE, ctx_size=$CTX_SIZE, mmap=$GGML_USE_MMAP" | tee -a "$LOG_FILE"
echo "[INFO] $(timestamp) OpenMP: OMP_NUM_THREADS=$OMP_NUM_THREADS, KMP_AFFINITY=$KMP_AFFINITY, GOMP_BLOCKTIME=$GOMP_BLOCKTIME, GOMP_CPU_AFFINITY=$GOMP_CPU_AFFINITY" | tee -a "$LOG_FILE"

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
# Ensure numactl is installed for NUMA interleaving
# ----------------------------------------------------------------------------
# ----------------------------------------------------------------------------
# Ensure numactl is installed for NUMA interleaving
# ----------------------------------------------------------------------------
if ! command -v numactl >/dev/null 2>&1; then
  echo "[INFO] $(timestamp) numactl not found; attempting to install..." | tee -a "$LOG_FILE"
  if command -v yum >/dev/null 2>&1; then
    yum install -y numactl >>"$LOG_FILE" 2>&1 && echo "[INFO] $(timestamp) numactl installed via yum." | tee -a "$LOG_FILE"
  elif command -v dnf >/dev/null 2>&1; then
    dnf install -y numactl >>"$LOG_FILE" 2>&1 && echo "[INFO] $(timestamp) numactl installed via dnf." | tee -a "$LOG_FILE"
  else
    echo "[WARN] $(timestamp) No suitable package manager found (yum/dnf); cannot install numactl. Continuing without NUMA interleaving." | tee -a "$LOG_FILE"
  fi
else
  echo "[INFO] $(timestamp) numactl already installed." | tee -a "$LOG_FILE"
fi
else
  echo "[INFO] $(timestamp) numactl already installed." | tee -a "$LOG_FILE"
fi

# ----------------------------------------------------------------------------
# Ensure Ollama Serve is Running with Optimized Flags
# ----------------------------------------------------------------------------
echo "[INFO] $(timestamp) Checking if ollama serve is already running..." | tee -a "$LOG_FILE"
EXISTING_PID=$(pgrep -f "ollama serve" | head -n1 || true)
if [ -n "$EXISTING_PID" ]; then
  echo "[INFO] $(timestamp) Terminating existing ollama serve (PID $EXISTING_PID) ..." | tee -a "$LOG_FILE"
  kill "$EXISTING_PID" || true
  sleep 1
fi

echo "[INFO] $(timestamp) Starting ollama serve with optimized flags..." | tee -a "$LOG_FILE"
# Build serve command
SERVE_CMD=(ollama serve --threads "$NPROC" --batch-size "$BATCH_SIZE" --ctx-size "$CTX_SIZE" --mmap)
# Wrap with numactl if installed
if command -v numactl >/dev/null 2>&1; then
  SERVE_CMD=(numactl --interleave=all "${SERVE_CMD[@]}")
  echo "[INFO] $(timestamp) Will use numactl for NUMA interleaving." | tee -a "$LOG_FILE"
else
  echo "[WARN] $(timestamp) numactl not available; skipping NUMA interleaving." | tee -a "$LOG_FILE"
fi
# Pin to cores and launch
taskset -c 0-$((NPROC-1)) nohup "${SERVE_CMD[@]}" >>"$LOG_FILE" 2>&1 &
PID=$!
echo "[INFO] $(timestamp) Started ollama serve (PID $PID) with threads=$NPROC, batch-size=$BATCH_SIZE, ctx-size=$CTX_SIZE, mmap enabled." | tee -a "$LOG_FILE"
sleep 2

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
fi
# Fallback to default Ollama port if detection fails
if [ -z "$PORT" ]; then
  PORT=11434
  echo "[WARN] $(timestamp) Could not detect serve port; defaulting to $PORT." | tee -a "$LOG_FILE"
else
  echo "[INFO] $(timestamp) ollama serve is listening on port $PORT." | tee -a "$LOG_FILE"
fi

# ----------------------------------------------------------------------------
# Warm‑Up Probe to Prime Runners
# ----------------------------------------------------------------------------
echo "[INFO] $(timestamp) Performing warm-up probe on http://127.0.0.1:$PORT/v1/models" | tee -a "$LOG_FILE"
if command -v curl >/dev/null 2>&1; then
  HEALTH_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:$PORT/v1/models")
  echo "[INFO] $(timestamp) Warm-up HTTP status code: $HEALTH_CODE" | tee -a "$LOG_FILE"
else
  echo "[WARN] $(timestamp) curl not found; skipping warm-up probe." | tee -a "$LOG_FILE"
fi

echo "[INFO] $(timestamp) All done." | tee -a "$LOG_FILE"
