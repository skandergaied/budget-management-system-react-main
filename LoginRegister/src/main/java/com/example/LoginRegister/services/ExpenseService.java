package com.example.LoginRegister.services;

import java.sql.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.LoginRegister.Request.ExpenseRequest;
import com.example.LoginRegister.dtos.ExpenseDto;
import com.example.LoginRegister.entites.Expense;
import com.example.LoginRegister.entites.User;
import com.example.LoginRegister.repositories.ExpenseRepository;
import com.example.LoginRegister.repositories.UserRepository;

import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor

public class ExpenseService {
    
  private final ExpenseRepository expenseRepository;
 
   
    @Autowired
    private JwtService jwtService;

   @Autowired
   private UserRepository userRepository;
  public Expense save(ExpenseRequest request, String authHeader) {
    
       String token = authHeader.substring(7);
        String userEmail = jwtService.extractUsername(token);
        
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));
    var expense = Expense.builder()
            .name(request.getName())
            .description(request.getDescription())
            .amount(request.getAmount())
            .date(request.getDate())
            .category(request.getCategory())
            .user(user)
            .build();
    return expenseRepository.save(expense);
    
}
     @Transactional
     public List<ExpenseDto> findAll() {
     System.out.println("findAll method called"+" "+ expenseRepository.findAll());
     return expenseRepository.findAll().stream()
        .map(expense -> new ExpenseDto(
            expense.getId(),
            expense.getName(),
            expense.getDescription(),
            expense.getAmount(),
            expense.getDate(),
            expense.getCategory(),
            expense.getUser().getId() 
        ))
        .toList(); 
     // return expenseRepository.findAll();
     }

     @Transactional
     public List<ExpenseDto> findby(long id) {
     System.out.println("findAll method called"+" "+ expenseRepository.findByUser_Id(id));
     return expenseRepository.findByUser_Id(id).stream()
        .map(expense -> new ExpenseDto(
            expense.getId(),
            expense.getName(),
            expense.getDescription(),
            expense.getAmount(),
            expense.getDate(),
            expense.getCategory(),
            expense.getUser().getId() 
        ))
        .toList(); 
     // return expenseRepository.findAll();
     }



    @Transactional
    public void deleteExpense(Long IncomesId) {
        expenseRepository.deleteById(IncomesId);
    }

    @Transactional
     public Expense updateExpenses(Long ExpenseId,ExpenseDto request) {
        Expense expenses = expenseRepository.findById(ExpenseId).orElseThrow();
        
        if (request.getName() != null) expenses.setName(request.getName());
        if (request.getDescription() != null) expenses.setDescription(request.getDescription());
        if (request.getAmount() != 0) expenses.setAmount(request.getAmount());
        if (request.getDate() != null) expenses.setDate(request.getDate());
        if (request.getCategory() != null) expenses.setCategory(request.getCategory());
       return expenseRepository.save(expenses);
    }

  




    
}
