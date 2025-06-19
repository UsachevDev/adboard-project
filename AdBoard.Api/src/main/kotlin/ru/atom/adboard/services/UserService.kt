package ru.atom.adboard.services

import io.jsonwebtoken.Claims
import org.springframework.http.HttpStatus
import org.springframework.security.core.Authentication
import org.springframework.stereotype.Service
import ru.atom.adboard.dal.repositories.UserRepository
import ru.atom.adboard.services.response.ServiceResponse
import ru.atom.adboard.services.response.UserProfileDto
import ru.atom.adboard.services.security.SecureService
import java.util.*


@Service
class UserService(_repo: UserRepository)
{
    private final val repo = _repo
    fun getUser(id: String?, authentication: Authentication): ServiceResponse
    {
        if(id == null && !authentication.isAuthenticated)
            return ServiceResponse(HttpStatus.NOT_FOUND)
        val isValidId = SecureService.isValidId(id)
        if(authentication.isAuthenticated && authentication.principal != "anonymousUser")
        {
            try {
                val claims = authentication.details as Claims
                if(!isValidId || id == claims.id )
                {
                    val user = repo.findUserById(UUID.fromString(claims["id"].toString()))
                    if(user.isPresent)
                        return ServiceResponse(
                            UserProfileDto(
                                user.get().email,
                                user.get().createdAt,
                                user.get().name,
                                user.get().phoneNumber,
                                user.get().city,
                                user.get().announcements,
                                user.get().reviews,
                                user.get().userReviews
                            ),
                            HttpStatus.OK
                        )
                }
            } catch (ex: Exception)
            {
                return ServiceResponse(HttpStatus.INTERNAL_SERVER_ERROR)
            }


        }
        if(SecureService.isValidId(id))
        {
            try{
                val user = repo.findUserById(UUID.fromString(id))
                if(user.isEmpty)
                    return ServiceResponse(HttpStatus.NOT_FOUND)

                return ServiceResponse(
                    UserProfileDto(
                        user.get().name,
                        user.get().createdAt,
                        user.get().announcements,
                        user.get().reviews,
                    ),
                    HttpStatus.OK
                )

            }catch (ex: Exception)
            {
                return ServiceResponse(HttpStatus.INTERNAL_SERVER_ERROR)
            }

        }
        return ServiceResponse(HttpStatus.BAD_REQUEST)
    }
}
