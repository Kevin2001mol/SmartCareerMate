// ai-service/src/main/java/com/smartcareermate/ai/SecurityConfig.java
package com.smartcareermate.ai;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    SecurityFilterChain open(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())          // quita CSRF para llamadas REST
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()          // TODO: proteger con Keycloak más tarde
            )
            .httpBasic(Customizer.withDefaults())  // deja Basic por si llamas directo
            .build();
    }
}
