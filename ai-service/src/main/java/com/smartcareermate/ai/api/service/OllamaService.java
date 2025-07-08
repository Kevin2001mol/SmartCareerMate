// OllamaService.java
package com.smartcareermate.ai.api.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
@RequiredArgsConstructor
public class OllamaService {

    private final WebClient client;

    public OllamaService(@Value("${spring.ai.ollama.url}") String url) {
        this.client = WebClient.builder().baseUrl(url).build();
    }

    public String chat(String prompt, double temperature) {

        var body = """
            {
              "model": "llama3",
              "prompt": "%s",
              "stream": false,
              "temperature": %f
            }""".formatted(prompt.replace("\"", "\\\""), temperature);

        return client.post()
                .uri("/api/generate")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .block();                     // ← blocking = simple
    }
}
