package ru.atom.adboard.services.security

import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletRequest
import org.apache.coyote.Response
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.ResponseCookie
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import java.util.*

object SecureService
{
    private val encoder: BCryptPasswordEncoder = BCryptPasswordEncoder(10)
    private val logger = LoggerFactory.getLogger(javaClass.name)

    @JvmStatic
    fun getBCryptHash(data: String) : Optional<String>
    {
        try
        {
            return Optional.of(encoder.encode(data))
        }
        catch (ex: Exception)
        {
            logger.error("Getting BCrypt hash error: ${ex.message}")
            return Optional.empty()
        }
    }

    @JvmStatic
    fun validateBCryptHash(data: String, hash: String) : Boolean
    {
        return encoder.matches(data,hash)
    }

    @JvmStatic
    fun getTokenFromHeader(request: HttpServletRequest) : Optional<String> {
        val AUTH_PREFIX = "Bearer "
        val authHeader = request.getHeader("Authorization")

        if (authHeader != null && authHeader.startsWith(AUTH_PREFIX))
            return Optional.of(authHeader.substring(AUTH_PREFIX.length))
        return Optional.empty()


    }

    @JvmStatic
    fun setRefreshToken(refreshToken: String) : ResponseCookie
    {
        val cookie = ResponseCookie.from("refreshToken", refreshToken)
            .path("/")
            .maxAge(7 * 24 * 60 * 60)
            .httpOnly(true)
            .sameSite("Strict")
            .secure(false)
            .build()
        return cookie
    }
    @JvmStatic
    fun removeRefreshToken(): ResponseCookie
    {
        val cookie = ResponseCookie.from("refreshToken", "")
            .path("/")
            .maxAge(0)
            .httpOnly(true)
            .sameSite("Strict")
            .secure(false)
            .build()
        return cookie
    }

    @JvmStatic
    fun isValidId(id: String?) : Boolean
    {
        try {
            if(id == null) return false
            UUID.fromString(id)
            return true
        } catch (e: java.lang.Exception) {
            return false
        }
    }



}
