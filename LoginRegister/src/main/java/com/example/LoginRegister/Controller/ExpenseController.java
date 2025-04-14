    package com.example.LoginRegister.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
 import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
 import org.springframework.web.bind.annotation.RestController;
import com.example.LoginRegister.Request.ExpenseRequest;
import com.example.LoginRegister.entites.Expense;
import com.example.LoginRegister.entites.User;
import com.example.LoginRegister.repositories.UserRepository;
import com.example.LoginRegister.services.ExpenseService;
import com.example.LoginRegister.services.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


    @RestController
    @RequiredArgsConstructor
    @RequestMapping("/api/v1/expense")
    public class ExpenseController {
        private final ExpenseService service;
       
      @PostMapping("/SKander")
      public ResponseEntity<?> findExpenseById(
     @Valid @RequestBody ExpenseRequest request, HttpServletRequest httpRequest
    
) {
    String authHeader = httpRequest.getHeader("Authorization");
   
    try {
        System.out.println("Request body: " + request);
        System.out.println("Auth header: " + httpRequest.getHeader("Authorization"));
        Expense savedExpense = service.save(request, authHeader);
        return ResponseEntity.ok(savedExpense);
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("Error: " + e.getMessage());
    }
} 


     @Autowired
    private JwtService jwtService;
    @Autowired
    private UserRepository userRepository;
@GetMapping("/Alx")
public ResponseEntity<?> findExpense( HttpServletRequest httpRequest) {
    
    
     
     

    try {
        String authHeader = httpRequest.getHeader("Authorization");

         System.out.println("Auth header: " + httpRequest.getHeader("Authorization"));
        String token = authHeader.substring(7);
         String emailString = jwtService.extractUsername(token);
        User user = userRepository.findByEmail(emailString).orElseThrow(() -> new RuntimeException("User not found"));
       long userId = user.getId();
       System.out.println("User IDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX: " + userId); 
        System.out.println("Authorization header: " ); 
        
        return ResponseEntity.ok(service.findby(userId));
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("Errordddddddddd: " + e.getMessage());
    }
      
}

    }
