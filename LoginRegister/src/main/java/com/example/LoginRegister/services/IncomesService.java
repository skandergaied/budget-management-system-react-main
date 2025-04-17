package com.example.LoginRegister.services;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.LoginRegister.Request.ExpenseRequest;
import com.example.LoginRegister.dtos.ExpenseDto;
import com.example.LoginRegister.entites.Incomes;
import com.example.LoginRegister.entites.User;
import com.example.LoginRegister.repositories.IncomesRepositry;
import com.example.LoginRegister.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor

public class IncomesService {
     @Autowired
    private JwtService jwtService;

   @Autowired
   private UserRepository userRepository;
    @Autowired
   private IncomesRepositry incomesRepositry;
  public Incomes save(ExpenseRequest request, String authHeader) {
       
       String token = authHeader.substring(7);
        String userEmail = jwtService.extractUsername(token);
     //   System.out.println("userEmailllllllllllllllllllllllllllllll"+request);
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));
    var income = Incomes.builder()
            .name(request.getName())
            .description(request.getDescription())
            .amount(request.getAmount())
            .date(request.getDate())
            .category(request.getCategory())
            .user(user)
            .build();
    
    System.out.println("userEmaillllllllllllllllllllfffffflllllllllll"+income);
    return incomesRepositry.save(income);
    
}
     @Transactional
     public List<ExpenseDto> findAll() {
     System.out.println("findAll method called"+" "+ incomesRepositry.findAll());
     return incomesRepositry.findAll().stream()
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
     System.out.println("findAll method called"+" "+ incomesRepositry.findByUser_Id(id));
     return incomesRepositry.findByUser_Id(id).stream()
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
        incomesRepositry.deleteById(IncomesId);
    }

    @Transactional
     public Incomes updateIncomes(Long IncomeId,ExpenseDto request) {
        Incomes incomes = incomesRepositry.findById(IncomeId).orElseThrow();
        
        if (request.getName() != null) incomes.setName(request.getName());
        if (request.getDescription() != null) incomes.setDescription(request.getDescription());
        if (request.getAmount() != 0) incomes.setAmount(request.getAmount());
        if (request.getDate() != null) incomes.setDate(request.getDate());
        if (request.getCategory() != null) incomes.setCategory(request.getCategory());
       return incomesRepositry.save(incomes);
    }
}