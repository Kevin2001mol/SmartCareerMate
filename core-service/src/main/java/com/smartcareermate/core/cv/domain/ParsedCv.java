package com.smartcareermate.core.cv.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Entity @Table(name = "parsed_cvs")
@Getter @Setter @NoArgsConstructor
@AllArgsConstructor @Builder
public class ParsedCv {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;                 // <- vendrá en el mensaje

    private String originalName;         // nombre del PDF

    @Column(columnDefinition = "text", nullable = false)
    private String rawText;              // texto plano extraído
    
    @Builder.Default
    @Column(nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();
}
