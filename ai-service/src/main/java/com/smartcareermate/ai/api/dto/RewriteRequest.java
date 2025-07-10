package com.smartcareermate.ai.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // getters, setters, toString…
@AllArgsConstructor // ctor con todos los campos
@NoArgsConstructor // ctor vacío (lo piden algunos serializadores)
public class RewriteRequest {
    private Long userId;
    private String cvText;
    private String offerText;
    private String language;
    private String tone;
    private double temperature;
}
