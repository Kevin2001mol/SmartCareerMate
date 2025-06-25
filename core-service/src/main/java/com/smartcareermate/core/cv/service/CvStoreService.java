// core-service/src/main/java/com/smartcareermate/core/cv/service/CvStoreService.java
package com.smartcareermate.core.cv.service;

import com.smartcareermate.core.cv.domain.CvDocument;
import com.smartcareermate.core.cv.repository.CvRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CvStoreService {

  private final CvRepository repo;

  public CvDocument save(Long userId, String fileName, String text) {
    var cv = new CvDocument();
    cv.setUserId(userId);
    cv.setOriginalName(fileName);
    cv.setRawText(text);
    return repo.save(cv);
  }
}
