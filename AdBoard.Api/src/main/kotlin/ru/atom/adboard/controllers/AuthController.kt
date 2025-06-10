package ru.atom.adboard.controllers

import jakarta.persistence.Entity
import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.ModelAttribute
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.atom.adboard.dal.entities.RefreshToken
import ru.atom.adboard.services.AuthService
import ru.atom.adboard.services.security.dtos.AuthRequest
import ru.atom.adboard.services.security.dtos.RefreshTokenRequest

@RestController
@RequestMapping("/api/auth")
class AuthController(_authService: AuthService)
{
    private val authService = _authService
    @PostMapping("/login")
    fun login(@ModelAttribute request: AuthRequest): Any
    {
        return authService.login(request)
    }

    @PostMapping("/refresh")
    fun refresh(@RequestBody request: RefreshTokenRequest): Any
    {
        return authService.refresh(request.refresh_token)
    }

    @GetMapping("/secured")
    fun secured(): ResponseEntity<String>
    {
        return ResponseEntity.ok("OMG!!!")
    }

    @PostMapping("/logout")
    fun logout(request: HttpServletRequest): ResponseEntity<Any>
    {
        val response = authService.logout(request)
        return response.build()
    }
}
