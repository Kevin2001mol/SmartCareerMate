# ai‑ollama.Dockerfile  ─ crea llama3:8b‑q4_0  (≈ 2,9 GB RAM)

FROM ollama/ollama:latest

# 0) utilidades mínimas
RUN apt-get update \
 && apt-get install -y --no-install-recommends curl \
 && rm -rf /var/lib/apt/lists/*

# 1) arranca el daemon en segundo plano
# 2) espera (máx 30 s) a que el puerto 11434 responda
# 3) descarga llama3:8b  y lo cuantiza a Q4_0
# 4) apaga el daemon
RUN set -eux; \
    ollama serve > /tmp/ollama.log 2>&1 & pid="$!"; \
    for i in $(seq 1 30); do \
        curl -sf http://localhost:11434/api/tags && break; \
        sleep 1; \
    done; \
    # descarga el modelo base
    ollama pull llama3:8b; \
    # lo cuantiza y lo guarda como llama3:8b‑q4_0
    ollama quantize llama3:8b --format q4_0 --output llama3:8b-q4_0; \
    # apaga el daemon
    kill "$pid"; \
    wait "$pid" || true
