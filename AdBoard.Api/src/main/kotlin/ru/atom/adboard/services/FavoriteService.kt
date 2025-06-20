package ru.atom.adboard.services

import org.apache.logging.log4j.LogManager
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import ru.atom.adboard.dal.repositories.AnnouncementRepository
import ru.atom.adboard.dal.repositories.UserRepository
import ru.atom.adboard.services.response.ServiceError
import ru.atom.adboard.services.response.ServiceResponse
import ru.atom.adboard.services.security.SecureService
import java.util.*

@Service
class FavoriteService(_userRepo: UserRepository, _announcementRepo: AnnouncementRepository)
{
    private final val userRepo = _userRepo
    private final val announcementRepo = _announcementRepo
    val logger = LogManager.getLogger(this.javaClass.name)

    fun addToFavorite(userId: String, announcementId: String) : ServiceResponse<Any>
    {
        if(!SecureService.isValidId(announcementId))
            return ServiceResponse(HttpStatus.BAD_REQUEST)

        try {
            val user = userRepo.findUserById(UUID.fromString(userId))
            if (user.isEmpty)
                return ServiceResponse(HttpStatus.INTERNAL_SERVER_ERROR, ServiceError("Authorize error"))

            val announcement = announcementRepo.findById(UUID.fromString(announcementId))
            if (announcement.isEmpty)
                return ServiceResponse(
                    HttpStatus.NOT_FOUND,
                    ServiceError("Announcement with id=${announcementId} was not found")
                )
            if (user.get().favorites.add(announcement.get()))
                userRepo.save(user.get())

            return ServiceResponse(HttpStatus.OK)
        } catch (ex: Exception) {
            logger.error(ex.message)
            return ServiceResponse(HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }



    fun removeFromFavorites(userId: String, announcementId: String): ServiceResponse<Any> {
        if(!SecureService.isValidId(announcementId))
            return ServiceResponse(HttpStatus.BAD_REQUEST)

        try {
            val user = userRepo.findUserById(UUID.fromString(userId))
            if (user.isEmpty)
                return ServiceResponse(HttpStatus.INTERNAL_SERVER_ERROR, ServiceError("Authorize error"))

            val announcement = announcementRepo.findById(UUID.fromString(announcementId))
            if (announcement.isEmpty)
                return ServiceResponse(
                    HttpStatus.NOT_FOUND,
                    ServiceError("Announcement with id=${announcementId} was not found")
                )
            if (user.get().favorites.remove(announcement.get()))
                userRepo.save(user.get())
            return ServiceResponse(HttpStatus.OK)
        } catch (ex: Exception) {
            logger.error(ex.message)
            return ServiceResponse(HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
