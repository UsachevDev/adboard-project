package ru.atom.adboard.services

import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.RequestBody
import ru.atom.adboard.dal.entities.RefreshToken
import ru.atom.adboard.dal.entities.User
import ru.atom.adboard.dal.repositories.RefreshTokenRepository
import ru.atom.adboard.services.security.JwtUtil
import ru.atom.adboard.services.security.SecureService
import ru.atom.adboard.services.security.dtos.AuthRequest
import ru.atom.adboard.services.security.dtos.AuthResponse
import java.util.*


@Service
class AuthService(_authManager: AuthenticationManager, _jwtUtil: JwtUtil, _refreshRepo: RefreshTokenRepository)
{
    private val authManager = _authManager
    private val jwtUtil = _jwtUtil
    private val refreshRepo = _refreshRepo

    fun logout(request: HttpServletRequest): ResponseEntity.BodyBuilder {
        try {
            val authHeader: String = request.getHeader("Authorization")
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                val jwt = authHeader.substring(7)
                val email: String = jwtUtil.extractEmail(jwt)

                val refreshToken = refreshRepo.findByUser_Email(email)
                if(refreshToken.isPresent) refreshRepo.delete(refreshToken.get())
            }

            return ResponseEntity.ok()
        } catch (ex: java.lang.Exception) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    fun refresh(refresh_token: String): Any {
        try {
            val refreshTokenFromDb: Optional<RefreshToken> = refreshRepo.findByToken(refresh_token)

            if (refreshTokenFromDb.isEmpty || refreshTokenFromDb.get().expiryDate
                    .before(Date())
            ) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            }

            val validRefreshToken = refreshTokenFromDb.get()
            val userDetails = validRefreshToken.user

            val newJwt: String =
                jwtUtil.generateAccessToken(userDetails.email)
            val newRefreshToken = jwtUtil.generateRefreshToken(userDetails.username)

            validRefreshToken.token = newRefreshToken
            validRefreshToken.expiryDate =  Date(System.currentTimeMillis() + jwtUtil.refreshTokenExpiration)
            refreshRepo.save(validRefreshToken)

            return ResponseEntity.ok<AuthResponse>(AuthResponse(newJwt, newRefreshToken))
        } catch (ex: Exception) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
        }
    }

    fun login(request: AuthRequest): Any {

        //TODO()
        val authentication = authManager.authenticate(UsernamePasswordAuthenticationToken(request.email,request.password))
        val userDetails: User = authentication.principal as User

        val accessToken = jwtUtil.generateAccessToken(authentication.name)
        val refreshToken = jwtUtil.generateRefreshToken(authentication.name)

        refreshRepo.save(
            RefreshToken(refreshToken, Date(System.currentTimeMillis() + jwtUtil.refreshTokenExpiration), userDetails)
        )
        return ResponseEntity<AuthResponse>(AuthResponse(accessToken,refreshToken), HttpStatus.OK)
    }

}
