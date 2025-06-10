package com.smartcareermate.core;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AliveController {

    @GetMapping("/api/hello")
    public String hello() {
        return "core-service OK";
    }
}
