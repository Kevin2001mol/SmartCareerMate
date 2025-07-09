// InterviewTurn.java
package com.smartcareermate.ai.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Primer turno: cvJson y offerText rellenos, history vacío.<br>
 * Turnos siguientes: solo history con el último par PREGUNTA / RESPUESTA.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InterviewTurn {

    private String cvJson;      // sólo se manda en el 1er turno
    private String offerText;   // idem
    private List<QA> history;   // historial (puede ir creciendo)

    /** Para Pregunta / Respuesta previa */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QA {
        private String question;
        private String answer;
    }
}
