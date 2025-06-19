package ru.atom.adboard.services

import org.apache.logging.log4j.LogManager
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import ru.atom.adboard.dal.entities.Announcement
import ru.atom.adboard.dal.repositories.AnnouncementRepository
import ru.atom.adboard.services.request.AddAnnouncementDto
import ru.atom.adboard.services.response.ServiceResponse
import java.util.*

@Service
class AnnouncementService(_repo: AnnouncementRepository)
{
    private final val repo = _repo
    private final val logger = LogManager.getLogger(this.javaClass.name)
    fun getAll() : ServiceResponse<List<Announcement>>
    {
        try{
            val announcements = repo.findAll()
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

}
