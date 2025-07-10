package com.smartcareermate.ai.api.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/** Sólo nos interesa el campo `response` que envía /api/generate */
@Getter @Setter @ToString
public class OllamaRaw {
    private String response;
}
