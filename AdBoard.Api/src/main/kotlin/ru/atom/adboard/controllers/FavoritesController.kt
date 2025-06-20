package ru.atom.adboard.controllers

import io.jsonwebtoken.Claims
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.atom.adboard.services.FavoriteService

@RestController
@RequestMapping("/api/favorites")
class FavoritesController(_service: FavoriteService) {
    private final val service = _service

    @PostMapping("/{announcementId}")
    fun addReview(@PathVariable announcementId: String) : ResponseEntity<Any>
    {
        val claims = SecurityContextHolder.getContext().authentication.details as Claims
        val serviceResponse = service.addToFavorite(claims.get("id").toString(), announcementId)
        val response = ControllerResponse(
            data = serviceResponse.data,
            error = serviceResponse.error
        )
        return ResponseEntity(response, serviceResponse.code)
    }

    @DeleteMapping("/{announcementId}")
    fun removeFromFavorites(@PathVariable announcementId: String) : ResponseEntity<Any>
    {
        val claims = SecurityContextHolder.getContext().authentication.details as Claims
        val serviceResponse = service.removeFromFavorites(claims.get("id").toString(), announcementId)
        val response = ControllerResponse(
            data = serviceResponse.data,
            error = serviceResponse.error
        )
        return ResponseEntity(response, serviceResponse.code)
    }
}
