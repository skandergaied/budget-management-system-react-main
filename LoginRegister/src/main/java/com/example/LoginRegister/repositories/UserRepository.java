package com.example.LoginRegister.repositories;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.LoginRegister.entites.User;


public interface UserRepository extends JpaRepository<User, Long> {

   
    Optional<User> findByEmail(String email);
}
