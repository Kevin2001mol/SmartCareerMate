package com.smartcareermate.core.cv.api;

import com.smartcareermate.core.cv.domain.ParsedCv;
import com.smartcareermate.core.cv.repository.ParsedCvRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cv")          // <- route estable para core-service
@RequiredArgsConstructor
public class CvCoreController {

    private final ParsedCvRepository repo;

    // GET /api/cv/42
    @GetMapping("/{id}")
    public ParsedCv findById(@PathVariable Long id){
        return repo.findById(id)
                   .orElseThrow(() -> new RuntimeException("CV not found"));
    }

    // GET /api/cv?user=7
    @GetMapping
    public List<ParsedCv> listByUser(@RequestParam("user") Long userId){
        return repo.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
