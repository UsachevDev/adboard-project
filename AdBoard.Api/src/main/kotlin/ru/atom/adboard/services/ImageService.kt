package ru.atom.adboard.services

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.apache.logging.log4j.LogManager
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import ru.atom.adboard.dal.entities.AdImage
import ru.atom.adboard.dal.repositories.AnnouncementRepository
import ru.atom.adboard.dal.repositories.ImageRepository
import ru.atom.adboard.services.response.ServiceError
import ru.atom.adboard.services.response.ServiceResponse
import ru.atom.adboard.services.security.SecureService
import java.util.*

@Service
class ImageService(_repo: AnnouncementRepository, _imageRepo: ImageRepository) {
    private final val repo = _repo
    private final val imageRepo = _imageRepo
    private final val logger = LogManager.getLogger(this.javaClass.name)

    fun uploadAnnouncementImages(userId: String, announcementId: String, image: MultipartFile) : ServiceResponse<String>
    {
        try {
            if (!SecureService.isValidId(announcementId))
                return ServiceResponse(HttpStatus.BAD_REQUEST, ServiceError("Invalid announcement id format"))

            val announcement = repo.findById(UUID.fromString(announcementId))
            if (announcement.isEmpty)
                return ServiceResponse(HttpStatus.NOT_FOUND)
            if (announcement.get().creatorId != UUID.fromString(userId))
                return ServiceResponse(
                    HttpStatus.FORBIDDEN,
                    ServiceError("You are not the creator of the announcement"))

            val imageUrl = imageRepo.saveImage(image, UUID.fromString(announcementId))
            val adImage = AdImage(UUID.randomUUID(), "${announcementId}/${image.originalFilename}", imageUrl,announcement.get())
            announcement.get().images.add(adImage)

            repo.save(announcement.get())
            return ServiceResponse(HttpStatus.OK)
        }
        catch (ex: Exception)
        {
            logger.error("IMAGE SAVING ERROR: ${ex.message}")
            return ServiceResponse(HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
}
