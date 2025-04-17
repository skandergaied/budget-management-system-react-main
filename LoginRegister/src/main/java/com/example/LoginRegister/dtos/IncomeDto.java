package com.example.LoginRegister.dtos;

import java.time.LocalDate;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class IncomeDto {
     private Long id;
    private String name;
    private String description;
    private double amount;
    private LocalDate date;
    private String category;

    public IncomeDto(Long id, String name, String description, double amount, LocalDate date, String category) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.amount = amount;
        this.date = date;
        this.category = category;
    
    }
    
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public double getAmount() {
        return amount;
    }

    public LocalDate getDate() {
        return date;
    }

    public String getCategory() {
        return category;
    }
}