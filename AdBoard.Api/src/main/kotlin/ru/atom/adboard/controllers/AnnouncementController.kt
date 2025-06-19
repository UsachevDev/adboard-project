package ru.atom.adboard.controllers

import io.jsonwebtoken.Claims
import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*
import org.springframework.web.servlet.support.ServletUriComponentsBuilder
import ru.atom.adboard.services.AnnouncementService
import ru.atom.adboard.services.request.AddAnnouncementDto
import java.net.URI

@RestController
@RequestMapping("api/announcements")
class AnnouncementController(_service: AnnouncementService)
{
    private final val service = _service
    @GetMapping("")
    fun getAll() : ResponseEntity<ControllerResponse>
    {
        val serviceResponse = service.getAll()
        return ResponseEntity(
            ControllerResponse(serviceResponse.data, serviceResponse.error),
            serviceResponse.code
        )
    }

    @PostMapping("")
    fun add(request: HttpServletRequest, @RequestBody announcementDTO: AddAnnouncementDto) : ResponseEntity<Any> {
        val claims = SecurityContextHolder.getContext().authentication.details as Claims
        val id = claims.get("id")
        val serviceResponse = service.add(announcementDTO, id.toString())

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
