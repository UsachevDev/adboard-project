package ru.atom.adboard.services

import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletRequest
import org.apache.logging.log4j.LogManager
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.AuthenticationException
import org.springframework.stereotype.Service
import ru.atom.adboard.dal.entities.RefreshToken
import ru.atom.adboard.dal.entities.User
import ru.atom.adboard.dal.repositories.RefreshTokenRepository
import ru.atom.adboard.dal.repositories.UserRepository
import ru.atom.adboard.services.response.ServiceResponse
import ru.atom.adboard.services.security.JwtUtil
import ru.atom.adboard.services.request.AuthRequest
import ru.atom.adboard.services.request.RegistrationRequest
import ru.atom.adboard.services.response.TokensDto
import ru.atom.adboard.services.response.ServiceError
import ru.atom.adboard.services.security.SecureService
import java.util.*


@Service
class AuthService(_authManager: AuthenticationManager, _jwtUtil: JwtUtil, _refreshRepo: RefreshTokenRepository, _userRepo: UserRepository)
{
    private val authManager = _authManager
    private val jwtUtil = _jwtUtil
    private val refreshRepo = _refreshRepo
    private val userRepo = _userRepo
    val logger = LogManager.getLogger(this.javaClass.name)
    fun logout(request: HttpServletRequest): ServiceResponse<Any> {
        try {
            val token = SecureService.getTokenFromHeader(request)
            if (token.isPresent) {
                val email: String = jwtUtil.extractEmail(token.get())
                val refreshToken = refreshRepo.findByUser_Email(email)
                if(refreshToken.isPresent) refreshRepo.delete(refreshToken.get())
            }
            return ServiceResponse(HttpStatus.OK)
        } catch (ex: java.lang.Exception) {
            return ServiceResponse(HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    fun refresh(refresh_token: String?): ServiceResponse<TokensDto> {
        if (refresh_token.isNullOrEmpty())
            return ServiceResponse(HttpStatus.UNAUTHORIZED)
        try {
            val refreshTokenFromDb: Optional<RefreshToken> = refreshRepo.findByToken(refresh_token)

            if (refreshTokenFromDb.isEmpty || refreshTokenFromDb.get().expiryDate
                    .before(Date())
            ) {
                return ServiceResponse(HttpStatus.UNAUTHORIZED, ServiceError("Login required"))
            }

            val validRefreshToken = refreshTokenFromDb.get()
            val userDetails = validRefreshToken.user

            val newJwt: String =
                jwtUtil.generateAccessToken(userDetails.email, userDetails.id)
            val newRefreshToken = jwtUtil.generateRefreshToken(userDetails.username)

            validRefreshToken.token = newRefreshToken
            validRefreshToken.expiryDate =  Date(System.currentTimeMillis() + jwtUtil.refreshTokenExpiration)
            refreshRepo.save(validRefreshToken)

            return ServiceResponse(TokensDto(newJwt,newRefreshToken), HttpStatus.OK)
        } catch (ex: Exception) {
            return ServiceResponse(HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    fun login(request: AuthRequest): ServiceResponse<TokensDto> {
        val authentication: Authentication

        try { authentication = authManager.authenticate(UsernamePasswordAuthenticationToken(request.email,request.password)) }
        catch (ex: AuthenticationException) { return ServiceResponse(HttpStatus.FORBIDDEN, ServiceError("Incorrect email or password")) }

        val userDetails: User = authentication.principal as User
        val accessToken = jwtUtil.generateAccessToken(userDetails.email, userDetails.id)
        val refreshToken = jwtUtil.generateRefreshToken(userDetails.email)

        try{
            val refreshTokenFromDb: Optional<RefreshToken> = refreshRepo.findByUser_Email(userDetails.email)
            if(refreshTokenFromDb.isPresent)
            {
                refreshTokenFromDb.get().token = refreshToken
                refreshTokenFromDb.get().expiryDate = Date(System.currentTimeMillis() + jwtUtil.refreshTokenExpiration)
                refreshRepo.save(refreshTokenFromDb.get())
            }
            else
                refreshRepo.save(RefreshToken(refreshToken, Date(System.currentTimeMillis() + jwtUtil.refreshTokenExpiration), userDetails))
        }
        catch (ex: Exception)
        {
            return ServiceResponse(HttpStatus.INTERNAL_SERVER_ERROR)
        }

        return ServiceResponse(TokensDto(accessToken,refreshToken), HttpStatus.OK)
    }

    fun registration(request: RegistrationRequest) : ServiceResponse<TokensDto>
    {
        logger.info("Запрос на регистрацию ${request.email}")
        try{
            if(userRepo.existsUserByEmail(request.email))
                return ServiceResponse(HttpStatus.OK, ServiceError("The user already exists"))

            val user = User(
                request.email,
                SecureService.getBCryptHash(request.password).get(),
                request.name,
                request.phoneNumber,
                request.city
            )
            val dbResponse = userRepo.save(user)
            val accessToken = jwtUtil.generateAccessToken(dbResponse.email, dbResponse.id)
            val refreshToken = jwtUtil.generateRefreshToken(user.email)


            refreshRepo.save(
                RefreshToken(refreshToken, Date(System.currentTimeMillis() + jwtUtil.refreshTokenExpiration), user)
            )

            return ServiceResponse(TokensDto(accessToken,refreshToken), HttpStatus.CREATED)
        }
        catch (ex: Exception)
        {
            return ServiceResponse(HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

}
