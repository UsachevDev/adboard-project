package ru.atom.adboard.services

import io.jsonwebtoken.Claims
import org.springframework.http.HttpStatus
import org.springframework.security.core.Authentication
import org.springframework.stereotype.Service
import ru.atom.adboard.dal.entities.User
import ru.atom.adboard.dal.repositories.UserRepository
import ru.atom.adboard.services.response.ServiceResponse
import ru.atom.adboard.services.response.UserProfileDto
import ru.atom.adboard.services.request.UserUpdateDto
import ru.atom.adboard.services.security.SecureService
import java.util.*


@Service
class UserService(_repo: UserRepository)
{
    private final val repo = _repo

    fun getUser(id: String?, authentication: Authentication): ServiceResponse<UserProfileDto>
    {
        if(id == null && !authentication.isAuthenticated)
            return ServiceResponse(HttpStatus.NOT_FOUND)
        val isValidId = SecureService.isValidId(id)

        if(!isValidId && id != null)
            return ServiceResponse(HttpStatus.BAD_REQUEST)

        if(authentication.isAuthenticated && authentication.principal != "anonymousUser")
        {
            try {
                val claims = authentication.details as Claims
                if(id == claims["id"].toString() || id == null)
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
        if(isValidId)
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

    fun updateUser(id: String, patch: UserUpdateDto): ServiceResponse<User> {
        try{
            val existingUser = repo.findUserById(UUID.fromString(id))
            if(existingUser.isEmpty)
                return ServiceResponse(HttpStatus.NOT_FOUND)

            patch.password?.let {existingUser.get().password = patch.password}
            patch.name?.let {existingUser.get().name = patch.name}
            patch.phoneNumber?.let {existingUser.get().phoneNumber = patch.phoneNumber}
            patch.city?.let {existingUser.get().city = patch.city}

            repo.save(existingUser.get())
            return ServiceResponse(HttpStatus.OK)
        }
        catch (ex: Exception)
        {
            return ServiceResponse(HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
