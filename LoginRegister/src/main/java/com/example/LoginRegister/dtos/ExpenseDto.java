package com.example.LoginRegister.dtos;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor            // <-- generates public ExpenseDto() { }
@AllArgsConstructor           // optional: generates a constructor with all fields
public class ExpenseDto {
    private Long id;
    private String name;
    private String description;
    private double amount;
    private LocalDate date;
    private String category;
    private Long userId;
    

}