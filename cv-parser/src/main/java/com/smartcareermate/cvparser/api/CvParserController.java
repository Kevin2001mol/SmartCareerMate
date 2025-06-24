package com.smartcareermate.cvparser.api;

import com.smartcareermate.cvparser.service.CvParserService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/cv")
public class CvParserController {

    private final CvParserService service;

    public CvParserController(CvParserService service) { this.service = service; }

    @PostMapping(path = "/parse", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String parse(@RequestPart MultipartFile file) throws Exception {
        return service.parse(file.getInputStream());
    }
}
