package com.smartcareermate.messaging;

import lombok.*;
import java.time.OffsetDateTime;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ParsedCvMessage {
    private Long userId;
    private String originalName;
    private String rawText;
    @Builder.Default
    private OffsetDateTime createdAt = OffsetDateTime.now();
}
