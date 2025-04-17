package com.example.LoginRegister.Controller;

import java.sql.SQLException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.LoginRegister.Request.ExpenseRequest;
import com.example.LoginRegister.dtos.ExpenseDto;
import com.example.LoginRegister.dtos.IncomeDto;
import com.example.LoginRegister.entites.Incomes;
import com.example.LoginRegister.entites.User;
import com.example.LoginRegister.repositories.UserRepository;
import com.example.LoginRegister.services.IncomesService;
import com.example.LoginRegister.services.JwtService;

import io.jsonwebtoken.io.IOException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor

@RequestMapping("/api/v1/income")
public class IncomesController {

      private final IncomesService service;
      @PostMapping("/create")
      public ResponseEntity<?> findIncomeById(
     @Valid @RequestBody ExpenseRequest request, HttpServletRequest httpRequest
    
) {
    String authHeader = httpRequest.getHeader("Authorization");
   
    try {
        Incomes savedIncomes = service.save(request, authHeader);
        IncomeDto incomeDto = new IncomeDto(savedIncomes.getId(), savedIncomes.getName(), savedIncomes.getDescription(), savedIncomes.getAmount(), savedIncomes.getDate(), savedIncomes.getCategory());
        return ResponseEntity.ok(incomeDto);
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
    @GetMapping("/my-incomes")
    public ResponseEntity<?> findIncome( HttpServletRequest httpRequest) {
        try {
        String authHeader = httpRequest.getHeader("Authorization");
        String token = authHeader.substring(7);
         String emailString = jwtService.extractUsername(token);
        User user = userRepository.findByEmail(emailString).orElseThrow(() -> new RuntimeException("User not found"));
       long userId = user.getId();
        return ResponseEntity.ok(service.findby(userId));
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("Errordddddddddd: " + e.getMessage());
    }
      
}    


@DeleteMapping("/DeleteIncome/{id}")
public ResponseEntity<?> DeleteIncome( @PathVariable Long id) {
    
        try {
            service.deleteExpense(id);
            return ResponseEntity.ok("Expense deleted successfully");
        } catch (Exception e) {

            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    
}

@PutMapping("/update/{IncomeId}")
    public ResponseEntity<?> Incomeupdate(@PathVariable Long IncomeId,
    @RequestBody ExpenseDto request) throws SQLException, IOException {

        try {
            Incomes updatedIncome = service.updateIncomes(IncomeId, request);
            // Convert entity to DTO before returning
            IncomeDto responseDto = new IncomeDto(updatedIncome.getId(), updatedIncome.getName(), updatedIncome.getDescription(), updatedIncome.getAmount(), updatedIncome.getDate(), updatedIncome.getCategory());
            
            return ResponseEntity.ok(responseDto);
        }  catch (Exception e) {
            // Log the exception details
            System.err.println("Error updating income: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        
    
    }
}