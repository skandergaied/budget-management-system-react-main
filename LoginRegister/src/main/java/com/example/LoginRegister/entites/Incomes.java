package com.example.LoginRegister.entites;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
@Entity
@Table(name = "income")
public class Incomes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "name", nullable = false)
    private String name;
    @Column(name = "description", nullable = false)
    private String description;
    @Column(name = "amount", nullable = false)
    private double amount;
    @Column(name = "date", nullable = false)
    private LocalDate date;
    @Column(name = "category", nullable = false)
    private String category;
   

    @ManyToOne()
    @JoinColumn(name = "user_id", nullable = true)
    private User user;
    
    @Override
    public String toString() {
        return "Expense{" +
               "id=" + id +
               ", name='" + name + '\'' +
               ", description='" + description + '\'' +
               ", amount=" + amount +
               ", date=" + date +
               ", category='" + category + '\'' +
               '}';
    }
    
}