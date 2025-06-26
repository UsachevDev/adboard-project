package ru.atom.adboard.services

import org.apache.logging.log4j.LogManager
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.jpa.domain.AbstractPersistable_.id
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import ru.atom.adboard.dal.entities.Announcement
import ru.atom.adboard.dal.entities.User
import ru.atom.adboard.dal.repositories.AnnouncementRepository
import ru.atom.adboard.services.request.AddAnnouncementDto
import ru.atom.adboard.services.request.UpdateAnnouncementDto
import ru.atom.adboard.services.request.UserUpdateDto
import ru.atom.adboard.services.response.ServiceError
import ru.atom.adboard.services.response.ServiceResponse
import ru.atom.adboard.services.security.SecureService
import java.util.*

@Service
class AnnouncementService(_repo: AnnouncementRepository)
{
    private final val repo = _repo
    private final val logger = LogManager.getLogger(this.javaClass.name)
    fun getAll() : ServiceResponse<List<Announcement>>
    {
        try{
            val announcements = repo.findAllByIsHiddenFalseWithSubcategoryAndCategory()
            return ServiceResponse(announcements, HttpStatus.OK)
        }
        catch (ex: Exception)
        {
            logger.error("Getting all announcements error: ${ex.message}")
            return ServiceResponse(HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    fun add(announcementDTO: AddAnnouncementDto, userID: String) : ServiceResponse<UUID>
    {
        val city =  if (announcementDTO.city.isNullOrEmpty()) "Moscow" else announcementDTO.city
        val announcement = Announcement(
            UUID.fromString(userID),
            announcementDTO.title,
            announcementDTO.description,
            announcementDTO.price,
            city,
            announcementDTO.count,
            UUID.fromString(announcementDTO.subcategoryId))

        try{
            val result = repo.save(announcement)
            return ServiceResponse(result.id,HttpStatus.CREATED)
        }
        catch (ex: Exception)
        {
            logger.error("Creating announcements error: ${ex.message}")
            return ServiceResponse(HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    fun updateAnnouncement(userId: String, announcementId : String, patch: UpdateAnnouncementDto): ServiceResponse<Announcement> {
        try{
            if(!SecureService.isValidId(announcementId))
                return ServiceResponse(HttpStatus.BAD_REQUEST, ServiceError("Invalid announcement id format"))

            val announcement = repo.findById(UUID.fromString(announcementId))
            if(announcement.isEmpty)
                return ServiceResponse(HttpStatus.NOT_FOUND)
            if(announcement.get().creatorId != UUID.fromString(userId))
                return ServiceResponse(HttpStatus.FORBIDDEN, ServiceError("You are not the creator of the announcement"))

            patch.title?.let {announcement.get().title = patch.title}
            patch.description?.let {announcement.get().description = patch.description}
            patch.price?.let {announcement.get().price = patch.price}
            patch.count?.let {announcement.get().count = patch.count}
            patch.isHidden?.let {announcement.get().isHidden = patch.isHidden}

            repo.save(announcement.get())
            return ServiceResponse(HttpStatus.OK)
        }
        catch (ex: Exception)
        {
            return ServiceResponse(HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    fun getById(announcementId: String) : ServiceResponse<Announcement>
    {
        if(announcementId.isEmpty() || !SecureService.isValidId(announcementId))
            return ServiceResponse(HttpStatus.BAD_REQUEST)

        try{
            val announcement = repo.findById(UUID.fromString(announcementId))
            if(announcement.isEmpty)
                return ServiceResponse(HttpStatus.NOT_FOUND)
            return ServiceResponse(announcement.get(), HttpStatus.OK)
        }
        catch (ex : Exception)
        {
            logger.error("Getting announcement by id error: ${ex.message}")
            return ServiceResponse(HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }

}
