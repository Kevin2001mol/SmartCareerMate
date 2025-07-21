# ai-ollama.Dockerfile  – cuantiza llama3:8b a Q4_0

FROM ollama/ollama:latest

# 0) utilidades
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

# 1) daemon en segundo plano
# 2) espera a que abra el puerto
# 3) crea el modelo cuantizado
# 4) apaga el daemon
RUN set -eux; \
    ollama serve > /tmp/ollama.log 2>&1 & pid="$!"; \
    for i in $(seq 1 30); do \
        curl -sf http://localhost:11434/api/tags && break; \
        sleep 1; \
    done; \
    printf 'FROM llama3:8b\nPARAMETER quantization Q4_0\n' > /tmp/Modelfile; \
    ollama create llama3:8b-q4_0 -f /tmp/Modelfile; \
    kill "$pid"; \
    wait "$pid" || true
