# ai-ollama.Dockerfile  – cuantiza llama3:8b a Q4_0

FROM ollama/ollama:cpu-nightly

RUN apt-get update \
 && apt-get install -y --no-install-recommends curl \
 && rm -rf /var/lib/apt/lists/*

RUN set -eux; \
    ollama serve > /tmp/ollama.log 2>&1 & pid="$!"; \
    for i in $(seq 1 30); do \
        curl -sf http://localhost:11434/api/tags && break; \
        sleep 1; \
    done; \
    ollama pull llama3:8b; \
    ollama quantize llama3:8b --format q4_0 --output llama3:8b-q4_0; \
    kill "$pid"; \
    wait "$pid" || true
