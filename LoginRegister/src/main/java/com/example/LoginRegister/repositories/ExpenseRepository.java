package com.example.LoginRegister.repositories;

import com.example.LoginRegister.entites.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

public interface  ExpenseRepository extends JpaRepository<Expense, Long> {
      
    
}
