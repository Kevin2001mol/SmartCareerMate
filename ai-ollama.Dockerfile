# ai-ollama.Dockerfile  – daemon puro; el modelo se descarga la 1ª vez
FROM ollama/ollama:latest

EXPOSE 11434
CMD ["ollama", "serve"]
