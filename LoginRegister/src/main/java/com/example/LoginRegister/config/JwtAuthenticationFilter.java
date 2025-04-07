package com.example.LoginRegister.config;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.LoginRegister.services.JwtService;

import io.micrometer.common.lang.NonNull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;


@Component
@RequiredArgsConstructor

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService Jwtservice;
    private final UserDetailsService userDetailsService;
    @Override
    protected void doFilterInternal(
        @SuppressWarnings("null") @NonNull HttpServletRequest request,
        @SuppressWarnings("null") @NonNull HttpServletResponse response, 
        @SuppressWarnings("null") @NonNull FilterChain filterChain
        )
        throws ServletException, IOException {
        final String authorizationHeader = request.getHeader("Authorization");
        final String tokenPrefix = "Bearer";
        final String jwt;
        final String userEmail;

        if (authorizationHeader == null || !authorizationHeader.startsWith(tokenPrefix)) {
            filterChain.doFilter(request, response);
            return;
            }
        
        jwt = authorizationHeader.substring(tokenPrefix.length());
    
        userEmail = Jwtservice.extractEmail(jwt);
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail); 
            if (Jwtservice.validateToken(jwt, userDetails)) {
               UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
               authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
               SecurityContextHolder.getContext().setAuthentication(authToken);
            }
            filterChain.doFilter(request, response);
            
            return;
        }


    
    }
}

