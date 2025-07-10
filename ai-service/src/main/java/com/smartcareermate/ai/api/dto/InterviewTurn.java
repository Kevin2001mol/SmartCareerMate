package com.smartcareermate.ai.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Primer turno: cvJson y offerText rellenos, history vacío.
 * Turnos siguientes: history con pares PREGUNTA / RESPUESTA.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InterviewTurn {

    private String cvJson;
    private String offerText;
    private List<QA> history;
    private String level;
    private String language;
    private String tone;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QA {
        private String question;
        private String answer;
    }
}
