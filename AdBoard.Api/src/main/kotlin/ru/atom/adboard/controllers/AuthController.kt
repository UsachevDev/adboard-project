package ru.atom.adboard.controllers

import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.HttpStatusCode
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CookieValue
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
import ru.atom.adboard.services.response.ServiceResponse
import ru.atom.adboard.services.response.TokensDto
import ru.atom.adboard.services.security.JwtUtil
import ru.atom.adboard.services.security.SecureService
import java.util.*

@RestController
@RequestMapping("/api/auth")
class AuthController(_authService: AuthService)
{
    private val authService = _authService
    @PostMapping("/login")
    fun login(@RequestBody request: AuthRequest): ResponseEntity<ControllerResponse<String>>
    {
        val serviceResponse: ServiceResponse<TokensDto> = authService.login(request)
        val headers = HttpHeaders()
        headers.add("Set-Cookie", getCookieWithRefreshToken(serviceResponse.data?.refresh_token))

        return ResponseEntity(
            ControllerResponse(serviceResponse.data?.access_token, serviceResponse.error),
            headers,
            serviceResponse.code,
        )
    }

    @PostMapping("/refresh")
    fun refresh(@CookieValue("refreshToken") refreshToken: String?): ResponseEntity<ControllerResponse<String>>
    {
        val serviceResponse = authService.refresh(refreshToken)

        val headers = HttpHeaders()
        headers.add("Set-Cookie", getCookieWithRefreshToken(serviceResponse.data?.refresh_token))

        return ResponseEntity(
            ControllerResponse(serviceResponse.data?.access_token, serviceResponse.error),
            headers,
            serviceResponse.code,
        )

    }

    @PostMapping("/logout")
    fun logout(request: HttpServletRequest): ResponseEntity<ControllerResponse<Any>>
    {
        val serviceResponse = authService.logout(request)
        val headers = HttpHeaders()
        headers.add("Set-Cookie", removeRefreshTokenFromCookie())
        val response = ResponseEntity(
            ControllerResponse(serviceResponse.data, serviceResponse.error),
            serviceResponse.code
        )

        return response
    }

    @PostMapping("/registration")
    fun registration(@RequestBody request: RegistrationRequest) : ResponseEntity<ControllerResponse<String>>
    {
        val serviceResponse: ServiceResponse<TokensDto> = authService.registration(request)
        val headers = HttpHeaders()
        headers.add("Set-Cookie", getCookieWithRefreshToken(serviceResponse.data?.refresh_token))

        return ResponseEntity(
            ControllerResponse(serviceResponse.data?.access_token, serviceResponse.error),
            headers,
            serviceResponse.code,
        )
    }

    @GetMapping("/test/secured")
    fun secured(): ResponseEntity<String>
    {
        return ResponseEntity.ok("OMG!!!")
    }

    private fun getCookieWithRefreshToken(refreshToken: String?): String
    {
        if(!refreshToken.isNullOrEmpty())
        {
            val cookie = SecureService.setRefreshToken(refreshToken)
            return cookie.toString()
        }
        return ""
    }

    private fun removeRefreshTokenFromCookie() : String
    {
        return SecureService.removeRefreshToken().toString()
    }


}
