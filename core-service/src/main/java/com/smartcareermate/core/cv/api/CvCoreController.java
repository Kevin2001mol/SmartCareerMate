// core-service/src/main/java/com/smartcareermate/core/cv/api/CvCoreController.java
package com.smartcareermate.core.cv.api;

import com.smartcareermate.core.cv.service.CvStoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/core/cv")
@RequiredArgsConstructor
public class CvCoreController {

  private final CvStoreService service;

  @PostMapping
  public void save(@RequestBody SaveCvDTO dto) {
    service.save(dto.userId(), dto.fileName(), dto.rawText());
  }

  record SaveCvDTO(Long userId, String fileName, String rawText) {}
}
