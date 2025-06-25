package com.smartcareermate.core;

import java.util.Map;               
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AliveController {

    @GetMapping("/api/hello")
    public String hello() {
        return "core-service OK";
    }
    @GetMapping("/api/alive")
    public Map<String, String> alive() {
        return Map.of("status", "alive");
    }
}
