package ru.atom.adboard.controllers

import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.HttpStatus
import org.springframework.http.HttpStatusCode
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.ModelAttribute
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.atom.adboard.dal.entities.RefreshToken
import ru.atom.adboard.dal.entities.User
import ru.atom.adboard.services.AuthService
import ru.atom.adboard.services.request.AuthRequest
import ru.atom.adboard.services.request.RefreshTokenRequest
import ru.atom.adboard.services.request.RegistrationRequest
import ru.atom.adboard.services.response.TokensDto
import ru.atom.adboard.services.security.SecureService
import java.util.*

@RestController
@RequestMapping("/api/auth")
class AuthController(_authService: AuthService)
{
    private val authService = _authService
    @PostMapping("/login")
    fun login(@ModelAttribute request: AuthRequest): ResponseEntity<Any>
    {
        val serviceResponse = authService.login(request)
        return ResponseEntity(
            ControllerResponse(serviceResponse.data, serviceResponse.error),
            serviceResponse.code
        )
    }

    @PostMapping("/refresh")
    fun refresh(@RequestBody request: RefreshTokenRequest): ResponseEntity<Any>
    {
        val serviceResponse = authService.refresh(request.refresh_token)
        return ResponseEntity(
            ControllerResponse(serviceResponse.data, serviceResponse.error),
            serviceResponse.code
        )
    }

    @PostMapping("/logout")
    fun logout(request: HttpServletRequest): ResponseEntity<Any>
    {
        val serviceResponse = authService.logout(request)
        return ResponseEntity(
            ControllerResponse(serviceResponse.data, serviceResponse.error),
            serviceResponse.code
        )
    }

    @PostMapping("/registration")
    fun registration(@RequestBody request: RegistrationRequest) : ResponseEntity<Any>
    {
        val serviceResponse = authService.registration(request)
        return ResponseEntity(
            ControllerResponse(serviceResponse.data, serviceResponse.error),
            serviceResponse.code
        )
    }

    @GetMapping("/test/secured")
    fun secured(): ResponseEntity<String>
    {
        return ResponseEntity.ok("OMG!!!")
    }
}
