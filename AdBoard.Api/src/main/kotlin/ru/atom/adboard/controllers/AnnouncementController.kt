package ru.atom.adboard.controllers

import io.jsonwebtoken.Claims
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*
import org.springframework.web.servlet.support.ServletUriComponentsBuilder
import ru.atom.adboard.dal.entities.Announcement
import ru.atom.adboard.services.AnnouncementService
import ru.atom.adboard.services.request.AddAnnouncementDto
import ru.atom.adboard.services.response.ServiceError
import java.net.URI

@Tag(name = "Announcements")
@RestController
@RequestMapping("api/announcements")
class AnnouncementController(_service: AnnouncementService)
{
    private final val service = _service
    @GetMapping("")
    @Operation(summary = "Get all announcements", description = "Get all announcements")
    @ApiResponses(value = [
        ApiResponse(
            responseCode = "200",
            description = "Successful retrieval of announcements",
            content = [Content(
                mediaType = "application/json",
                schema = Schema(
                    implementation = ControllerResponse::class,
                    requiredProperties = ["data"],
                    example = """{
                        "data": [
                            {
                                "id": "550e8402-e29b-41d4-a716-446655440002",
                                "title": "Продажа квартиры",
                                "description": "2-комнатная квартира в центре",
                                "price": 150000.0,
                                "city": "Москва",
                                "count": 1,
                                "creatorId": "550e8400-e29b-41d4-a716-446655440000",
                            }
                        ]
                    }"""
                )
            )]),
        ApiResponse(responseCode = "500", description = "Server error")
    ])
    fun getAll() : ResponseEntity<ControllerResponse<List<Announcement>>>
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
