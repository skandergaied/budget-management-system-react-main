package com.example.LoginRegister.services;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.LoginRegister.auth.AuthenticationRequest;
import com.example.LoginRegister.auth.AuthenticationResponse;
import com.example.LoginRegister.auth.RegisterRequest;
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
        .role(request.getRole())
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
        .orElseThrow();
    
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse
        .builder()
        .accessToken(jwtToken)
        .build();
      }

    
}
