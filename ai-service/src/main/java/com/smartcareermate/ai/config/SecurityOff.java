package com.smartcareermate.ai.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Desactiva por completo la seguridad HTTP.
 * (solo recomendable en entorno de desarrollo)
 */
@Configuration
public class SecurityOff {

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())          // sin CSRF
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll())     // todo permitido
                .build();
    }
}
