// RewriteController.java
package com.smartcareermate.ai.api;

import com.smartcareermate.ai.api.dto.*;
import com.smartcareermate.ai.api.service.OllamaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
public class RewriteController {

    private final OllamaService ollama;

    /* --------- 1. CV adaptado ------------------------------------------ */
    @PostMapping("/rewrite")
    public RewriteResponse rewrite(@RequestBody RewriteRequest req) {

        String prompt = """
            Eres un experto en RRHH. Reescribe este CV para adaptarlo
            a la oferta indicada, manteniendo un tono %s y en %s.

            ### CV
            %s

            ### OFERTA
            %s
            """.formatted(req.getTone(), req.getLanguage(),
                          req.getCvText(), req.getOfferText());

        String answer = ollama.chat(prompt, req.getTemperature());
        return new RewriteResponse(answer);
    }

    /* --------- 2. Carta de presentación -------------------------------- */
    @PostMapping("/cover-letter")
    public CoverLetterResponse letter(@RequestBody CoverLetterRequest req) {

        String prompt = """
            Redacta una carta de presentación en %s y con tono %s
            ajustando la experiencia del candidato al puesto.

            ### CV
            %s

            ### OFERTA
            %s
            """.formatted(req.getLanguage(), req.getTone(),
                          req.getCvText(), req.getOfferText());

        String answer = ollama.chat(prompt, req.getTemperature());
        return new CoverLetterResponse(answer);
    }
}
