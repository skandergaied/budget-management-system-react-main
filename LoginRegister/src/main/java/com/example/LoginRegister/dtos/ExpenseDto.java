package com.example.LoginRegister.dtos;

import java.time.LocalDate;

import lombok.Data;


@Data
public class ExpenseDto {
    private Long id;
    private String name;
    private String description;
    private double amount;
    private LocalDate date;
    private String category;
    private Long userId; // Include user ID if needed
    public ExpenseDto(Long id, String name, String description, double amount, LocalDate date, String category, Long userId) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.amount = amount;
        this.date = date;
        this.category = category;
        this.userId = userId;
    }
}