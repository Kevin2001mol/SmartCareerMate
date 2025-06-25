package com.smartcareermate.core.cv.messaging;

import lombok.Data;
import java.time.OffsetDateTime;

@Data
public class ParsedCvMessage {
    private Long  userId;
    private String originalName;
    private String rawText;
    private OffsetDateTime createdAt;
}
