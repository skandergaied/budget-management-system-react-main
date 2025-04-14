package com.example.LoginRegister.repositories;

import com.example.LoginRegister.entites.Expense;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface  ExpenseRepository extends JpaRepository<Expense, Long> {

    //  Optional<Expense> findByEmail(String email);
      List<Expense> findByUserId(Long userId);
      List<Expense> findByUser_Id(Long userId);
      
    
}
