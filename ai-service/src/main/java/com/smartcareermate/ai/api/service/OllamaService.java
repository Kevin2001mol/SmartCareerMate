package com.smartcareermate.ai.api.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class OllamaService {

    private final WebClient.Builder builder;

    @Value("${spring.ai.ollama.url}")
    private String baseUrl;
    @Value("${spring.ai.ollama.model}")
    private String model;

    public String chat(String prompt, double temperature) {

        Map<String, Object> body = Map.of(
                "model", model,
                "prompt", prompt,
                "stream", false,
                "options", Map.of("temperature", temperature));

        return builder.baseUrl(baseUrl).build()
                .post().uri("/api/generate")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}
