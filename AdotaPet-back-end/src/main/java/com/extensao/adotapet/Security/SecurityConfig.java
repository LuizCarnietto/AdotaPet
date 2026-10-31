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
import org.springframework.http.HttpMethod;

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

                        // Público: login
                        .requestMatchers("/auth/**").permitAll()

                        // Público: cadastro de usuário
                        .requestMatchers(HttpMethod.POST, "/usuario").permitAll()

                        // Público: perfil de uma ONG específica
                        .requestMatchers(HttpMethod.GET, "/usuario/ong/**").permitAll()

                        // Somente a ONG autenticada lista seus próprios animais
                        .requestMatchers(HttpMethod.GET, "/animal/ong").hasAuthority("ROLE_ONG")

                        // Público: animais de uma ONG específica
                        .requestMatchers(HttpMethod.GET, "/animal/ong/*").permitAll()

                        // Público: visualização de animais
                        .requestMatchers(HttpMethod.GET, "/animal/**").permitAll()

                        // Somente ONG cadastra animal
                        .requestMatchers(HttpMethod.POST, "/animal").hasAuthority("ROLE_ONG")

                        // Somente ONG exclui animal
                        .requestMatchers(HttpMethod.DELETE, "/animal/**").hasAuthority("ROLE_ONG")

                        // Público: imagens
                        .requestMatchers(HttpMethod.GET, "/uploads/**").permitAll()

                        // Todo o restante exige autenticação
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