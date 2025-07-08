package com.smartcareermate.ai.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class CoverLetterRequest {
    private Long userId;
    private String cvText;
    private String offerText;
    private String language;
    private String tone;
    private double temperature;
}