# ai-ollama.Dockerfile  – usa el modelo ya cuantizado
FROM ollama/ollama:latest

# (opcional) utilidades mínimas
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

# descarga a la capa de la imagen el modelo ligero
RUN ollama pull llama3:8b-text-q3_K_S

# puerto por defecto
EXPOSE 11434

CMD ["ollama", "serve"]
