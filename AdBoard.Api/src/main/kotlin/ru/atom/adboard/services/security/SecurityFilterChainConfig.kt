package ru.atom.adboard.services.security

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.web.SecurityFilterChain

@Configuration
@EnableWebSecurity
class SecurityFilterChainConfig
{
    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .authorizeHttpRequests { authorize ->
                authorize
                    .requestMatchers(HttpMethod.POST,"/api/users").permitAll() // Доступ для всех
                    .anyRequest().authenticated() // Все остальные требуют аутентификации

            }
            .csrf { csrf ->
                csrf.ignoringRequestMatchers("/api/users")

            }
        return http.build()
    }
}
