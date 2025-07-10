# ai-ollama.Dockerfile
FROM ollama/ollama:latest

# 1.    lanza el daemon en segundo plano
# 2-a.  espera a que abra el puerto (≤ 30 s)
# 2-b.  descarga el modelo
# 3.    apaga el daemon con su PID, espera a que salga
RUN set -eux; \
    ollama serve > /tmp/ollama.log 2>&1 & \
    pid="$!"; \
    for i in $(seq 1 30); do \
        curl -sf http://localhost:11434/ || { sleep 1; continue; }; \
        break; \
    done; \
    ollama pull llama3; \
    kill "$pid"; \
    wait "$pid" || true
