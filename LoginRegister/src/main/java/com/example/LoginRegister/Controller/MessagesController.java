package com.example.LoginRegister.Controller;

import org.springframework.web.bind.annotation.RestController;


import java.util.Arrays;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
public class MessagesController {
    @GetMapping("/Messages")
    public ResponseEntity<List<String> > getMethodName(@RequestParam(required = false) String param) {
        return ResponseEntity.ok(Arrays.asList("First","Second"));
    }
    
}
