package com.example.LoginRegister.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
 import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
 import org.springframework.web.bind.annotation.RestController;
import com.example.LoginRegister.Request.ExpenseRequest;
import com.example.LoginRegister.dtos.ExpenseDto;
import com.example.LoginRegister.dtos.IncomeDto;
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

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    // ✅ Save a new expense
    @PostMapping("/create")
    public ResponseEntity<?> createExpense(
            @Valid @RequestBody ExpenseRequest request,
            HttpServletRequest httpRequest
    ) {
        String authHeader = httpRequest.getHeader("Authorization");

        try {
            Expense savedExpense = service.save(request, authHeader);

            IncomeDto responseDto = new IncomeDto(
                savedExpense.getId(),
                savedExpense.getName(),
                savedExpense.getDescription(),
                savedExpense.getAmount(),
                savedExpense.getDate(),
                savedExpense.getCategory()
            );

            return ResponseEntity.ok(responseDto);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }

    // ✅ Get all expenses for the authenticated user
    @GetMapping("/all")
    public ResponseEntity<?> getExpenses(HttpServletRequest httpRequest) {
        try {
            String authHeader = httpRequest.getHeader("Authorization");
            String token = authHeader.substring(7);
            String email = jwtService.extractUsername(token);

            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

            return ResponseEntity.ok(service.findby(user.getId()));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }

    // ✅ Delete an expense by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id) {
        try {
            service.deleteExpense(id);
            return ResponseEntity.ok("Expense deleted successfully");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }

    // ✅ Update an expense by ID
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateExpense(
            @PathVariable Long id,
            @RequestBody ExpenseDto request
    ) {
        try {
            Expense updatedExpense = service.updateExpenses(id, request);

            IncomeDto responseDto = new IncomeDto(
                updatedExpense.getId(),
                updatedExpense.getName(),
                updatedExpense.getDescription(),
                updatedExpense.getAmount(),
                updatedExpense.getDate(),
                updatedExpense.getCategory()
            );

            return ResponseEntity.ok(responseDto);

        } catch (Exception e) {
            System.err.println("Error updating expense: " + e.getMessage());
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error: " + e.getMessage());
        }
    }
}

