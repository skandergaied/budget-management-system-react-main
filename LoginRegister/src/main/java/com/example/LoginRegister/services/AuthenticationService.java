package com.example.LoginRegister.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.LoginRegister.auth.AuthenticationRequest;
import com.example.LoginRegister.auth.AuthenticationResponse;
import com.example.LoginRegister.auth.RegisterRequest;
import com.example.LoginRegister.entites.Role;
import com.example.LoginRegister.entites.User;
import com.example.LoginRegister.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor

public class AuthenticationService {
     
     private final PasswordEncoder passwordEncoder;
     private final JwtService jwtService;
     private final AuthenticationManager authenticationManager;
     private final UserRepository repository;

    public AuthenticationResponse register(RegisterRequest request) {
    var user = User.builder()
        .firstName(request.getFirstName())
        .lastName(request.getLastName())
        .email(request.getEmail())
        .password(passwordEncoder.encode(request.getPassword()))
        .role(request.getRole() != null ? request.getRole() : Role.USER) 
        .build();

        
        var jwtToken = jwtService.generateToken(user);
        
        repository.save(user);
        
        return AuthenticationResponse
        .builder()
        .accessToken(jwtToken)
        .build();
    
  }
     

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
            )
        );
        var user = repository.findByEmail(request.getEmail())
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            if (user != null) {
                System.out.println("Stored password hash: " + user.getPassword());
                System.out.println("Does password match: " + 
                    passwordEncoder.matches(request.getPassword(), user.getPassword()));
            }
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse
            .builder()
            .accessToken(jwtToken)
            .build();
            
    } 

    @Autowired
    private UserRepository userRepository;

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User is not authenticated");
        }
        String username = authentication.getName();
        return userRepository.findByEmail(username).orElseThrow(() -> new RuntimeException("User not found"));
    }


    
}
