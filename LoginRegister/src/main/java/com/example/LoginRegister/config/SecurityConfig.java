package com.example.LoginRegister.config; 
 import lombok.RequiredArgsConstructor; 
 import org.springframework.context.annotation.Bean; 
 import org.springframework.context.annotation.Configuration; 
 import org.springframework.security.authentication.AuthenticationProvider; 
 import org.springframework.security.config.annotation.web.builders.HttpSecurity; 
 import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
  import org.springframework.security.config.http.SessionCreationPolicy; 
  import org.springframework.security.web.SecurityFilterChain; 
  import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
  import org.springframework.web.cors.CorsConfiguration; 
  import org.springframework.web.filter.CorsFilter;


import static org.springframework.security.config.Customizer.withDefaults;
import java.util.Arrays;
  import java.util.Collections;
    import org.springframework.http.HttpHeaders;
    import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

    @Configuration @EnableWebSecurity @RequiredArgsConstructor 
    public class SecurityConfig {     
         private final JwtAuthenticationFilter jwtAuthFilter;     
         private final AuthenticationProvider authenticationProvider;   
            @Bean     
            public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception { 
                        http       
                         .cors(withDefaults())                  
                        .csrf(csrf -> csrf.disable()) 
                        .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers("/api/v1/expense/**","/api/v1/income/**").authenticated() 
                        .anyRequest().authenticated())         
                         .sessionManagement(session -> session  .sessionCreationPolicy(SessionCreationPolicy.STATELESS)  )     
                        .authenticationProvider(authenticationProvider) 
                         .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)  
                         ;          return http.build();     } 
                         
                         
        @Bean
         public CorsFilter corsFilter() {
        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        final CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(Collections.singletonList("http://localhost:3000"));
        config.setAllowedHeaders(Arrays.asList(
                HttpHeaders.ORIGIN,
                HttpHeaders.CONTENT_TYPE,
                HttpHeaders.ACCEPT,
                HttpHeaders.AUTHORIZATION
        ));
        config.setAllowedMethods(Arrays.asList(
                "GET",
                "POST",
                "DELETE",
                "PUT",
                "PATCH"
        ));
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);

        }  } 