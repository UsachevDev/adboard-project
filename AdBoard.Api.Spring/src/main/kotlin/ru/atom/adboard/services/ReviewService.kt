package ru.atom.adboard.services

import org.apache.logging.log4j.LogManager
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import ru.atom.adboard.dal.entities.Review
import ru.atom.adboard.dal.repositories.AnnouncementRepository
import ru.atom.adboard.dal.repositories.UserRepository
import ru.atom.adboard.services.request.AddReviewRequest
import ru.atom.adboard.services.response.ServiceError
import ru.atom.adboard.services.response.ServiceResponse
import ru.atom.adboard.services.security.SecureService
import java.util.*

@Service
class ReviewService(_userRepo: UserRepository, _announcementRepo: AnnouncementRepository)
{
    private final val userRepo = _userRepo
    private final val announcementRepo = _announcementRepo
    val logger = LogManager.getLogger(this.javaClass.name)


    fun addReview(buyerId: String, announcementId: String, reviewDto: AddReviewRequest) : ServiceResponse<UUID> {
        if (!SecureService.isValidId(announcementId))
            return ServiceResponse(HttpStatus.BAD_REQUEST, ServiceError("Неверный формат announcementID"))
        if (reviewDto.score !in 1..10)
            return ServiceResponse(HttpStatus.BAD_REQUEST, ServiceError("Оценка должна быть в пределах от 1 до 10"))

        try {
            val buyer = userRepo.findUserById(UUID.fromString(buyerId))
            if (buyer.isEmpty)
                return ServiceResponse(HttpStatus.INTERNAL_SERVER_ERROR)

            val announcement = announcementRepo.findById(UUID.fromString(announcementId))
            if (announcement.isEmpty)
                return ServiceResponse(HttpStatus.NOT_FOUND)

            if(buyerId == announcement.get().creatorId.toString())
                return ServiceResponse(HttpStatus.BAD_REQUEST, ServiceError("Нельзя создать отзыв на свое же объявление"))

            val review = Review(
                UUID.randomUUID(),
                UUID.fromString(buyerId),
                announcement.get().creatorId,
                UUID.fromString(announcementId),
                reviewDto.score,
                reviewDto.description
            )
            buyer.get().reviews.add(review)
            userRepo.save(buyer.get())
            return ServiceResponse(data = review.id, HttpStatus.CREATED)
        } catch (ex: Exception) {
            logger.error(ex.message)
            return ServiceResponse(HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

}
