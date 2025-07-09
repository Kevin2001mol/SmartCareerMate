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
    private static final ObjectMapper MAPPER = new ObjectMapper();

    /* ───────────────────────────── ENDPOINT ───────────────────────────── */
    @PostMapping("/interview")
    public InterviewResponse interview(@RequestBody InterviewTurn turn) {

        /* lista de preguntas previas */
        List<String> prev = turn.getHistory() == null
                ? List.of()
                : turn.getHistory().stream().map(InterviewTurn.QA::getQuestion).toList();

        /* construimos prompt base + refuerzo de idioma/tono */
        String lang = turn.getLanguage(); // “es”, “en”… <- vienen del front
        String tone = turn.getTone(); // “formal”, …
        String base = buildPrompt(turn, prev,
                "\n💡 Responde **exclusivamente en " + lang +
                        "** y con un tono **" + tone + "**.\n" +
                        "El campo `feedback` debe ir en el mismo idioma.\n" +
                        "Si este NO ES el primer turno, `feedback` es obligatorio.");

        /* primer intento */
        String raw = ollama.chat(base, 0.2);
        InterviewResponse out = parseSafe(raw);

        /* hasta 2 re-intentos si repite pregunta */
        for (int i = 0; i < 2 && prev.contains(out.getQuestion()); i++) {
            log.warn("Pregunta repetida, reintento {} …", i + 1);
            String again = buildPrompt(turn, prev,
                    "\n⚠️ NO repitas nada de `previousQuestions`. Formula otra diferente.");
            raw = ollama.chat(again, 0.2);
            out = parseSafe(raw);
        }
        // si es el primer turno, vaciamos feedback y forzamos score=0
        if (turn.getHistory() == null || turn.getHistory().isEmpty()) {
            out.setFeedback("");
            out.setScore(0.0);
        }
        return out;
    }

    /* ───────────────────── helper: construye prompt ───────────────────── */
    private String buildPrompt(InterviewTurn t, List<String> prevQ, String extra) {

        StringBuilder sb = new StringBuilder("""
                Eres reclutador de RRHH. Dispones del JSON del candidato y de la oferta.
                Cada turno:
                1· Formula UNA nueva pregunta relacionada con el puesto
                   (NO repitas ninguna de previousQuestions).
                2· Si `lastAnswer` NO está vacío, **evalúala** y da un `score` (0.0-1.0).
                **DEVUELVE SIEMPRE** un único JSON **exacto** con los tres campos:
                  • question (string)
                  • feedback (string)
                  • score    (number)
                Incluso en el primer turno, donde no hay respuesta previa,
                devuelve `"feedback":""` y `"score":0.0`.
                Ejemplo:
                {"question":"¿...?","feedback":"","score":0.0}
                """).append(extra);

        /* primer turno */
        if (prevQ.isEmpty()) {
            sb.append("\n### CV\n").append(t.getCvJson())
                    .append("\n### OFERTA\n").append(t.getOfferText());
        } else {
            var last = t.getHistory().get(t.getHistory().size() - 1);
            sb.append("\n### lastQuestion\n").append(last.getQuestion())
                    .append("\n### lastAnswer\n").append(last.getAnswer());
        }

        try {
            sb.append("\n### previousQuestions\n")
                    .append(MAPPER.writeValueAsString(prevQ))
                    .append("\n### HISTORY\n")
                    .append(MAPPER.writeValueAsString(t.getHistory()));
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("No se pudo serializar history", e);
        }
        return sb.toString();
    }

    /* ───────────────────── helper: parseo robusto ─────────────────────── */
    private InterviewResponse parseSafe(String raw) {
        String cleaned = raw
                .replaceAll("(?is)```json|```", "")
                .replaceAll("(?s)^.*?\\{", "{")
                .replaceAll("}\\s*[^}]*$", "}");
        try {
            return MAPPER.readValue(cleaned, InterviewResponse.class);
        } catch (JsonProcessingException e) {
            log.error("❌ JSON inválido devuelto por Ollama:\n{}", raw);
            throw new IllegalStateException("Respuesta JSON inválida de Ollama", e);
        }
    }
}
