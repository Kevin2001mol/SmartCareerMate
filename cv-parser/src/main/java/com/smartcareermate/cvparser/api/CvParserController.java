package com.smartcareermate.cvparser.api;

import com.smartcareermate.cvparser.service.CvParserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/cv")
@RequiredArgsConstructor
public class CvParserController {

    private final CvParserService service;

    /**
     * POST /api/cv/parse?userId=7 con un PDF en el body.
     */
    @PostMapping(path = "/parse", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String parse(@RequestParam Long userId,
            @RequestPart MultipartFile file) throws Exception {

        return service.parseAndSend(userId,
                file.getOriginalFilename(),
                file.getInputStream());
    }
}
