# ai-ollama.Dockerfile  – opción B
FROM ollama/ollama:latest

# 1) inicia el daemon
# 2) espera a que esté listo
# 3) crea la versión cuantizada llama3:8b‑q4_0 mediante un Modelfile
# 4) apaga el daemon
RUN set -eux; \
    ollama serve > /tmp/ollama.log 2>&1 & pid="$!"; \
    for i in $(seq 1 30); do \
        curl -sf http://localhost:11434/ && break; \
        sleep 1; \
    done; \
    printf 'FROM llama3:8b\nPARAM quant Q4_0\n' > /tmp/Modelfile; \
    ollama create llama3:8b-q4_0 -f /tmp/Modelfile; \
    kill "$pid"; \
    wait "$pid" || true
