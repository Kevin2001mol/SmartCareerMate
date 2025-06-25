// core-service/src/main/java/com/smartcareermate/core/cv/repository/CvRepository.java
package com.smartcareermate.core.cv.repository;

import com.smartcareermate.core.cv.domain.CvDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CvRepository extends JpaRepository<CvDocument, Long> {
    List<CvDocument> findByUserIdOrderByCreatedAtDesc(Long userId);
}
