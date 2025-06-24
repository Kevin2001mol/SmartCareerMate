package com.smartcareermate.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

/**
 * Llama a Ollama en localhost:11434 y pide al modelo "mistral"
 * que diga "Hello" en español.  Responde el texto generado.
 */
@RestController
public class PingController {

    private final WebClient ollama;
    private static final Logger logger = LoggerFactory.getLogger(PingController.class);

    public PingController(@Value("${spring.ai.ollama.url}") String ollamaUrl) {
        this.ollama = WebClient.builder()
                .baseUrl(ollamaUrl)
                .build();
    }

    @GetMapping("/ai/ping")
    public String ping() {
        logger.info("[PingController] /ai/ping endpoint called");
        logger.info("[PingController] Using Ollama URL from config");
        // Construir el cuerpo de la petición para /api/generate
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "llama3"); // changed from "mistral" to "llama3"
        requestBody.put("prompt", "Say 'Hello' in Spanish");
        requestBody.put("stream", false);
        logger.info("[PingController] Request body: {}", requestBody);
        try {
            Mono<String> response = ollama.post()
                    .uri("/api/generate")
                    .bodyValue(requestBody)
                    .retrieve()
                    .onStatus(status -> !status.is2xxSuccessful(), clientResponse -> {
                        return clientResponse.bodyToMono(String.class).flatMap(errorBody -> {
                            logger.error("[PingController] Ollama error response: {}", errorBody);
                            return Mono.error(new RuntimeException("Ollama error: " + errorBody));
                        });
                    })
                    .bodyToMono(String.class);
            String result = response.block();
            logger.info("[PingController] Ollama response: {}", result);
            return result;
        } catch (Exception e) {
            logger.error("[PingController] Error calling Ollama: {}", e.getMessage(), e);
            throw e;
        }
    }
}
