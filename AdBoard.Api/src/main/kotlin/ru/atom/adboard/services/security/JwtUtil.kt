package ru.atom.adboard.services.security

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.Claims
import io.jsonwebtoken.MalformedJwtException
import io.jsonwebtoken.security.Keys
import lombok.Getter
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.stereotype.Component
import java.util.*
import javax.crypto.SecretKey

@Component
@Getter
class JwtUtil(
    @Value("\${jwt.access-token-key}") accessTokenSecret: String,
    @Value("\${jwt.refresh-token-key}") refreshTokenSecret: String,
    @Value("\${jwt.access-token-duration}") accessTokenDuration: Long,
    @Value("\${jwt.refresh-token-duration}") refreshTokenDuration: Long
)
{
    private val accessTokenKey: SecretKey = Keys.hmacShaKeyFor(accessTokenSecret.toByteArray())
    private val refreshTokenKey: SecretKey = Keys.hmacShaKeyFor(refreshTokenSecret.toByteArray())
    private val accessTokenExpiration: Long = accessTokenDuration // 10 минут
    val refreshTokenExpiration: Long = refreshTokenDuration // 7 дней

    fun generateAccessToken(email: String, id: UUID): String {
        return Jwts.builder()
            .subject(email)
            .issuedAt(Date())
            .expiration(Date(System.currentTimeMillis() + accessTokenExpiration))
            .claims(mutableMapOf(Pair("id", id)))
            .signWith(accessTokenKey)
            .compact()
    }

    fun generateRefreshToken(email: String): String {
        return Jwts.builder()
            .subject(email)
            .issuedAt(Date())
            .expiration(Date(System.currentTimeMillis() + refreshTokenExpiration))
            .signWith(refreshTokenKey)
            .compact()
    }

    fun extractEmail(token: String, isRefreshToken: Boolean = false): String {
        return extractClaims(token, isRefreshToken).subject
    }

    fun validateAccessToken(token: String):  Pair<Boolean, String?> {
        return try {
            Jwts.parser()
                .verifyWith(accessTokenKey)
                .build()
                .parseSignedClaims(token)
            true to null
        } catch (e: MalformedJwtException) {
            false to "Invalid JWT token format"
        } catch (e: io.jsonwebtoken.ExpiredJwtException) {
            false to "JWT token is expired"
        } catch (e: Exception) {
            false to "Error processing JWT token"
        }
    }

    fun validateRefreshToken(token: String): Boolean {
        return try {
            Jwts.parser()
                .verifyWith(refreshTokenKey)
                .build()
                .parseSignedClaims(token)
            true
        } catch (e: Exception) {
            false
        }
    }

    fun extractClaims(token: String, isRefreshToken: Boolean): Claims {
        val key = if (isRefreshToken) refreshTokenKey else accessTokenKey
        return Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .payload
    }

}
