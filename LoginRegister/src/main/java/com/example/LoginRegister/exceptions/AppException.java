package com.example.LoginRegister.exceptions;

import org.springframework.http.HttpStatus;


public class AppException extends RuntimeException{
    
    private final HttpStatus status = null;
    
    public AppException(String message, HttpStatus status) {
        super(message);
    }

    public HttpStatus getStatus() {
        return status;
    }
    
}
