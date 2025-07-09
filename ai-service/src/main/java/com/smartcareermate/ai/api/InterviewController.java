package com.smartcareermate.ai.api;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartcareermate.ai.api.dto.InterviewResponse;
import com.smartcareermate.ai.api.dto.InterviewTurn;
import com.smartcareermate.ai.api.service.OllamaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
@Slf4j
public class InterviewController {

    private final OllamaService ollama;

    /* ───────── ObjectMapper reutilizable ───────── */
    private static final ObjectMapper MAPPER = new ObjectMapper();

    /* ───────── Endpoint principal ───────── */
    @PostMapping("/interview")
    public InterviewResponse interview(@RequestBody InterviewTurn turn) {

        StringBuilder sb = new StringBuilder("""
                Eres reclutador de RRHH. Tienes el siguiente JSON con los datos
                del candidato y la oferta. Debes:
                  1. Hacer **una sola** pregunta sobre el puesto.
                  2. Si `lastAnswer` no es vacío, evaluar la respuesta (1-2 líneas)
                     y dar un score de 0-1.
                Responde **EXCLUSIVAMENTE** con JSON válido (sin markdown, sin texto
                extra) con este esquema exacto:
                { "question": "...", "feedback": "...", "score": 0.0 }
                """);

        /* ---------- 1er turno ---------- */
        List<InterviewTurn.QA> history = turn.getHistory();
        if (history == null || history.isEmpty()) {
            sb.append("\n### CV\n").append(turn.getCvJson())
                    .append("\n### OFERTA\n").append(turn.getOfferText());
        }
        /* ---------- turnos siguientes ---------- */
        else {
            InterviewTurn.QA last = history.get(history.size() - 1);
            sb.append("\n### PREGUNTA_PREVIA\n").append(last.getQuestion())
                    .append("\n### RESPUESTA_CANDIDATO\n").append(last.getAnswer());
        }

        /* ---------- llamada a Ollama + parseo seguro ---------- */
        String raw = ollama.chat(sb.toString(), 0.2);
        return parseSafe(raw);
    }

    /* ───────── Limpieza y parseo robusto ───────── */
    private InterviewResponse parseSafe(String raw) {
        // 1. Elimina posibles bloques ```json ...``` o texto sobrante
        String cleaned = raw
                .replaceAll("(?si)```json|```", "") // quita marcas markdown
                .replaceAll("(?s)^.*?\\{", "{") // desde 1er '{'
                .replaceAll("}\\s*[^}]*$", "}"); // hasta último '}'

        try {
            return MAPPER.readValue(cleaned, InterviewResponse.class);
        } catch (JsonProcessingException ex) {
            log.error("❌ Error parseando JSON de Ollama. Payload original:\n{}", raw, ex);
            throw new IllegalStateException("Respuesta JSON inválida de Ollama", ex);
        }
    }
}
