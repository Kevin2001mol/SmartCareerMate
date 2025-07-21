# ai‑ollama.Dockerfile ─ cuantiza llama3:8b a Q4_0
FROM ollama/ollama:latest

RUN apt-get update \
 && apt-get install -y --no-install-recommends curl \
 && rm -rf /var/lib/apt/lists/*

RUN set -eux; \
    # 1) daemon en segundo plano
    ollama serve > /tmp/ollama.log 2>&1 & pid="$!"; \
    # 2) espera a que abra el puerto (máx 30 s)
    for i in $(seq 1 30); do \
        curl -sf http://localhost:11434/api/tags && break; \
        sleep 1; \
    done; \
    # 3) Modelfile con QUANTIZE
    printf 'FROM llama3:8b\nQUANTIZE Q4_0\n' > /tmp/Modelfile; \
    ollama create llama3:8b-q4_0 -f /tmp/Modelfile; \
    # 4) apaga daemon
    kill "$pid"; \
    wait "$pid" || true
