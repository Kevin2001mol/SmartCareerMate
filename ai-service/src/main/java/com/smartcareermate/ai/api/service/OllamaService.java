package com.smartcareermate.ai.api.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class OllamaService {

    private final WebClient client;

    public OllamaService(WebClient.Builder builder,
            @Value("${spring.ai.ollama.url}") String ollamaUrl) {
        this.client = builder
                .baseUrl(ollamaUrl) // http://ollama:11434
                .build();
    }

    public String chat(String prompt, double temperature) {

        Map<String, Object> body = Map.of(
                "model", "llama3",
                "prompt", prompt,
                "temperature", temperature,
                "stream", false);

        return client.post()
                .uri("/api/generate")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}
