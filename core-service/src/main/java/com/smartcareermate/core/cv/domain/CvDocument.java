// core-service/src/main/java/com/smartcareermate/core/cv/domain/CvDocument.java
package com.smartcareermate.core.cv.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "parsed_cvs")
@Data @NoArgsConstructor
public class CvDocument {

  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private Long userId;
  private String originalName;

  @Lob @Column(columnDefinition = "TEXT")
  private String rawText;

  private Instant createdAt = Instant.now();
}
