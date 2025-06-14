package ru.atom.adboard.services.security

import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import ru.atom.adboard.services.response.ServiceError
import ru.atom.adboard.services.response.ServiceResponse
import java.io.PrintWriter

@Component
class JwtAuthFilter(private val jwtParcer: JwtUtil, private val objectMapper: ObjectMapper): OncePerRequestFilter() {
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val token = SecureService.getTokenFromHeader(request)
        if(token.isPresent)
        {
            val (isValid, errorMsg) = jwtParcer.validateAccessToken(token.get())
            if(isValid)
            {
                val email = jwtParcer.extractEmail(token.get())
                val authentication = UsernamePasswordAuthenticationToken(email, null, emptyList())
                authentication.details = jwtParcer.extractClaims(token.get(), false)
                SecurityContextHolder.getContext().authentication = authentication
            }
            else
            {
                sendErrorResponse(response, HttpStatus.UNAUTHORIZED, errorMsg ?: "Invalid JWT token")
                return
            }
        }
        filterChain.doFilter(request,response)
    }

    private fun sendErrorResponse(response: HttpServletResponse, status: HttpStatus, message: String) {
        response.status = status.value()
        response.contentType = MediaType.APPLICATION_JSON_VALUE
        val writer: PrintWriter = response.writer
        objectMapper.writeValue(writer, ServiceResponse(HttpStatus.UNAUTHORIZED, ServiceError(message)))
        writer.flush()
    }
}
