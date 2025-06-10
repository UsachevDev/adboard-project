package ru.atom.adboard.services.security

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.authentication.dao.DaoAuthenticationProvider
import org.springframework.security.config.Customizer
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter


@Configuration
@EnableWebSecurity
class SecurityFilterChainConfig(_userDetails: CustomUserDetails)
{
    private final val userDetails = _userDetails
    @Bean
    fun securityFilterChain(http: HttpSecurity, jwtAuthFilter: JwtAuthFilter): SecurityFilterChain {
        http
            .csrf { conf -> conf.disable()}
            .authorizeHttpRequests { request ->
                request.requestMatchers(HttpMethod.POST, "/api/users", "/api/auth/login", "/api/auth/refresh").permitAll().anyRequest().authenticated()
            }
            .httpBasic(Customizer.withDefaults())
            .sessionManagement{ session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)}
            .addFilterAt(jwtAuthFilter, UsernamePasswordAuthenticationFilter::class.java)
        return http.build()
    }
    @Bean
    fun authenticationManager(authConfig: AuthenticationConfiguration): AuthenticationManager {
        return authConfig.authenticationManager
    }

    @Bean
    fun passwordEncoder() : PasswordEncoder
    {
        return BCryptPasswordEncoder(10)
    }
//
//
//    @Bean
//    fun authenticationProvider(): AuthenticationProvider {
//        val provider = DaoAuthenticationProvider()
//        provider.setPasswordEncoder(passwordEncoder())
//        provider.setUserDetailsService(userDetails)
//        return provider
//    }


}
