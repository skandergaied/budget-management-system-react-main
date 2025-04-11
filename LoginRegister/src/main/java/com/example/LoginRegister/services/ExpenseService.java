package com.example.LoginRegister.services;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.LoginRegister.Request.ExpenseRequest;
import com.example.LoginRegister.entites.Expense;
import com.example.LoginRegister.entites.User;
import com.example.LoginRegister.repositories.ExpenseRepository;

import jakarta.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor

public class ExpenseService {
  private final ExpenseRepository expenseRepository;
  private final AuthenticationService userService;
  private static final Logger logger = LoggerFactory.getLogger(ExpenseService.class);
   @Transactional
    public Expense eResponse(ExpenseRequest request,Authentication connectedUser) {
      try {

        logger.info("Connected user: {}", connectedUser);
     

        var expense = Expense.builder()
            .name(request.getName())
            .description(request.getDescription())
            .amount(request.getAmount())
            .date(request.getDate())
            .category(request.getCategory())
           // .user(user)
            .build();

        logger.info("Saving expense: {}", expense);
        return expenseRepository.save(expense);
    } catch (Exception e) {
        logger.error("Error saving expense", e);
        throw e; 
    }
  
  }

  public Expense save(ExpenseRequest request) {
   
    System.out.println("Connected userfffffffffffffffffffffffff: ");
     Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    
    System.out.println("Authentication: " + authentication);

    var expense = Expense.builder()
            .name(request.getName())
            .description(request.getDescription())
            .amount(request.getAmount())
            .date(request.getDate())
            .category(request.getCategory())
           // .user(username)
            .build();
    return expenseRepository.save(expense);
    
}
    
}
