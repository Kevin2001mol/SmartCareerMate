package com.smartcareermate.core.cv.repository;

import com.smartcareermate.core.cv.domain.ParsedCv;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ParsedCvRepository extends JpaRepository<ParsedCv, Long> {
    List<ParsedCv> findByUserIdOrderByCreatedAtDesc(Long userId);
}
