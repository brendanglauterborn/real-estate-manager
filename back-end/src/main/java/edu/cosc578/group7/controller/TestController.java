package edu.cosc578.group7.controller;  // 👈 Your actual package (adjust if needed)

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")  // Will be served at /api/test
public class TestController {

    @GetMapping
    public String test() {
        return "Hello from Spring Boot!";
    }
}
