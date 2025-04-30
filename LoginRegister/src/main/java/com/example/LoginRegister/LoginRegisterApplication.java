package com.example.LoginRegister;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;


@SpringBootApplication
public class LoginRegisterApplication {


    @Autowired
    private InMemoryUserDetailsManager inMemoryUserDetailsManager;

	public static void main(String[] args) {
		SpringApplication.run(LoginRegisterApplication.class, args);}
		
}


