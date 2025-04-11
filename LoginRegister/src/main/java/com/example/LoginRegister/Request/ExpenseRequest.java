package com.example.LoginRegister.Request;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class ExpenseRequest {
    
    private Long id;
    
    private String name;
    
    private String description;
   
    private double amount;
    
    private LocalDate date;
   
    private String category;
}
