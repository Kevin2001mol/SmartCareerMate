// InterviewResponse.java
package com.smartcareermate.ai.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Respuesta del servicio de IA:
 *  • question  → siguiente pregunta que hace el “reclutador”
 *  • feedback  → evaluación de la respuesta anterior (puede ir vacío en el 1er turno)
 *  • score     → 0-1 para colorear o mostrar una barra de porcentaje en el front
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InterviewResponse {

    private String question;
    private String feedback;
    private double score;
}
