package com.example.LoginRegister.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.LoginRegister.entites.Incomes;

public interface IncomesRepositry extends JpaRepository<Incomes, Long>{
      List<Incomes> findByUserId(Long userId);
      List<Incomes> findByUser_Id(Long userId);
}