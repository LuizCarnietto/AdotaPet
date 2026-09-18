package com.extensao.adotapet.Security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        return http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth

                        // público: login
                        .requestMatchers("/auth/**").permitAll()

                        // público: cadastro de usuário
                        .requestMatchers(
                                org.springframework.http.HttpMethod.POST,"/usuario").permitAll()

                        // somente ONG lista seus animais
                        .requestMatchers(
                                org.springframework.http.HttpMethod.GET,"/animal/ong").hasAuthority("ROLE_ONG")

                        // público: visualização de animais
                        .requestMatchers(
                                org.springframework.http.HttpMethod.GET,"/animal/**").permitAll()

                        // somente ONG cadastra animal
                        .requestMatchers(
                                org.springframework.http.HttpMethod.POST,"/animal").hasAuthority("ROLE_ONG")

                        // somente ONG exclui animal
                        .requestMatchers(
                                org.springframework.http.HttpMethod.DELETE, "/animal/**").hasAuthority("ROLE_ONG")

                        // tudo o resto precisa login
                        .anyRequest().authenticated()
                )

                .exceptionHandling(ex -> ex

                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(401);
                            response.setContentType("application/json");

                            response.getWriter().write("""
                            {
                              "status": 401,
                              "error": "Usuário não autenticado"
                            }
                            """);
                        })

                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(403);
                            response.setContentType("application/json");

                            response.getWriter().write("""
                            {
                              "status": 403,
                              "error": "Acesso negado"
                            }
                            """);
                        })
                )

                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)

                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of("http://localhost:5173"));

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

        config.setAllowedHeaders(List.of("*"));

        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }

}