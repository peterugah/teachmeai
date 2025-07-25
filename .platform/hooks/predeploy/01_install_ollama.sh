#!/usr/bin/env bash
set -e

# write logs into the existing web.stdout.log
LOG_FILE=/var/log/web.stdout.log

timestamp() {
  date '+%Y-%m-%d %H:%M:%S'
}

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

for model in mistral nomic-embed-text; do
  echo "[INFO] $(timestamp) Pulling model '$model'..." | tee -a "$LOG_FILE"
  ollama pull "$model" 2>&1 | tee -a "$LOG_FILE"
  echo "[INFO] $(timestamp) Model '$model' pulled successfully." | tee -a "$LOG_FILE"
done

echo "[INFO] $(timestamp) Checking if ollama serve is already running..." | tee -a "$LOG_FILE"
if pgrep -f "ollama serve" >/dev/null 2>&1; then
  echo "[INFO] $(timestamp) ollama serve is already running." | tee -a "$LOG_FILE"
else
  echo "[INFO] $(timestamp) ollama serve not running. Starting ollama serve..." | tee -a "$LOG_FILE"
  nohup ollama serve >>"$LOG_FILE" 2>&1 &
  echo "[INFO] $(timestamp) ollama serve started." | tee -a "$LOG_FILE"
fi

echo "[INFO] $(timestamp) All done." | tee -a "$LOG_FILE"
