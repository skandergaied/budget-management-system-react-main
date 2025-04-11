    package com.example.LoginRegister.Controller;

    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
    import org.springframework.web.bind.annotation.RequestBody;
    import org.springframework.web.bind.annotation.RequestMapping;
    import org.springframework.web.bind.annotation.RestController;

    import com.example.LoginRegister.Request.ExpenseRequest;
import com.example.LoginRegister.entites.Expense;
import com.example.LoginRegister.services.ExpenseService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
    import lombok.RequiredArgsConstructor;

    @RestController
    @RequiredArgsConstructor
    @RequestMapping("/api/v1/expense")
    public class ExpenseController {
        private final ExpenseService service;
    
       
    
        @PostMapping("/Expense")
        public ResponseEntity<?> Expregister(
            @Valid @RequestBody ExpenseRequest request,
            Authentication connectedUser
        ) {
            System.out.println("Authorization header: " + connectedUser); // Debugging
            return ResponseEntity.ok(service.eResponse(request, connectedUser));
        }
       @PostMapping("/SKander")
public ResponseEntity<?> findExpenseById(
    @Valid @RequestBody ExpenseRequest request, HttpServletRequest httpRequest
    
) {
    String authHeader = httpRequest.getHeader("Authorization");
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        System.out.println("No valid authorization heasssssssssssssssssssssssder found");
    
    }
    else {
        System.out.println("Authorization header founddddddddddddddddddddddddddddddddddddddddddd: " + authHeader);
    }
    try {
        System.out.println("Request body: " + request);
      //  System.out.println("Auth header: " + httpRequest.getHeader("Authorization"));
        Expense savedExpense = service.save(request);
        return ResponseEntity.ok(savedExpense);
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("Error: " + e.getMessage());
    }
}

    }
