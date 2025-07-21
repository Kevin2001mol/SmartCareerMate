
FROM ollama/ollama:latest

RUN apt-get update && apt-get install -y --no-install-recommends curl \
 && rm -rf /var/lib/apt/lists/*

RUN set -eux; \
    ollama serve > /tmp/ollama.log 2>&1 & pid="$!"; \
    for i in $(seq 1 30); do \
        curl -sf http://localhost:11434/api/tags && break; \
        sleep 1; \
    done; \
    printf 'FROM llama3:8b\nPARAMETER quant Q4_0\n' > /tmp/Modelfile; \
    ollama create llama3:8b-q4_0 -f /tmp/Modelfile; \
    kill "$pid"; \
    wait "$pid" || true
