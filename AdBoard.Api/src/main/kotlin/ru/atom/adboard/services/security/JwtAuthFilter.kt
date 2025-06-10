package ru.atom.adboard.services.security

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class JwtAuthFilter(private val jwtParcer: JwtUtil): OncePerRequestFilter() {
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val AUTH_PREFIX : String = "Bearer "
        val authHeader = request.getHeader("Authorization")
        if(authHeader != null && authHeader.startsWith(AUTH_PREFIX))
        {
            val token = authHeader.substring(AUTH_PREFIX.length)
            if(jwtParcer.validateAccessToken(token))
            {
                val email = jwtParcer.extractEmail(token)
                val authentication = UsernamePasswordAuthenticationToken(email, null, emptyList())
                authentication.details = WebAuthenticationDetailsSource().buildDetails(request)
                SecurityContextHolder.getContext().authentication = authentication
            }
        }
        filterChain.doFilter(request,response)
    }
}
