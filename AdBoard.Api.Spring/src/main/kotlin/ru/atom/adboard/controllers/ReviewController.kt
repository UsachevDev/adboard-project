package ru.atom.adboard.controllers

import io.jsonwebtoken.Claims
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.servlet.support.ServletUriComponentsBuilder
import ru.atom.adboard.services.ReviewService
import ru.atom.adboard.services.request.AddReviewRequest
import java.net.URI
import java.util.*

@RestController
@RequestMapping("/api/reviews")
class ReviewController(_service: ReviewService)
{
    private final val service = _service
    @PostMapping("/{announcementId}")
    fun addReview(@PathVariable announcementId: String, @RequestBody review: AddReviewRequest) : ResponseEntity<Any>
    {
        val claims = SecurityContextHolder.getContext().authentication.details as Claims
        val serviceResponse = service.addReview(claims.get("id").toString(), announcementId, review)
        if(serviceResponse.code == HttpStatus.CREATED)
        {
            val location: URI = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(serviceResponse.data)
                .toUri()

            return ResponseEntity.created(location).build()
        }
        return ResponseEntity(
            ControllerResponse(serviceResponse.data, serviceResponse.error),
            serviceResponse.code
        )
    }
}
