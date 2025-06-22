package ru.atom.adboard.controllers

import io.jsonwebtoken.Claims
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.headers.Header
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.ExampleObject
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import org.hibernate.sql.Update
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*
import org.springframework.web.servlet.support.ServletUriComponentsBuilder
import ru.atom.adboard.dal.entities.Announcement
import ru.atom.adboard.dal.entities.User
import ru.atom.adboard.services.AnnouncementService
import ru.atom.adboard.services.request.AddAnnouncementDto
import ru.atom.adboard.services.request.UpdateAnnouncementDto
import ru.atom.adboard.services.request.UserUpdateDto
import java.net.URI

@Tag(name = "Announcements")
@RestController
@RequestMapping("api/announcements")
class AnnouncementController(_service: AnnouncementService)
{
    private final val service = _service
    @GetMapping("")
    @Operation(summary = "Get all announcements")
    @ApiResponses(value = [
        ApiResponse(
            responseCode = "200",
            description = "Successful retrieval of announcements",
            content = [Content(
                mediaType = "application/json",
                schema = Schema(
                    implementation = ControllerResponse::class,
                    requiredProperties = ["data"],
                    description = "Response containing a list of announcements"
                ),
                examples = [ExampleObject(
                    value = """{
                        "data": [
                            {
                                "id": "073e17ec-3b55-4f0f-9821-381bfe1e4b57",
                                "creatorId": "b4066a61-61f3-4dc4-bd12-f81f78173a22",
                                "title": "Продажа квартиры",
                                "description": "2-комнатная квартира в центре города, отличное состояние",
                                "price": 150000.0,
                                "city": "Москва",
                                "count": 1,
                                "subcategoryId": "7450ebf5-7ddc-4b26-a771-35c69e375ea0",
                                "reviews": [],
                                "favoriteBy": [],
                                "subcategory": {
                                    "id": "7450ebf5-7ddc-4b26-a771-35c69e375ea0",
                                    "name": "Квартиры"
                                }
                            }
                        ]
                    }"""
                )]
            )]
        ),
        ApiResponse(responseCode = "500", description = "Server error", content = [Content(mediaType = "application/json", examples = [ExampleObject(value = "{}")])])
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
    @Operation(summary = "Add an announcement")
    @ApiResponses(
        ApiResponse(responseCode = "201", description = "Created", headers = [Header(name = "Location", description = "URI of the newly created announcement", schema = Schema(type = "string", example = "http://localhost:8080/api/announcements/{id}"))], content = [Content(mediaType = "application/json", examples = [ExampleObject(value = "")])]),
        ApiResponse(responseCode = "400", description = "Bad request", content = [Content(mediaType = "application/json", examples = [ExampleObject(value = "")])]),
        ApiResponse(responseCode = "500", description = "Internal server error", content = [Content(mediaType = "application/json", examples = [ExampleObject(value = "")])])
    )
    fun add(@RequestBody announcementDTO: AddAnnouncementDto) : ResponseEntity<Any> {
        val claims = SecurityContextHolder.getContext().authentication.details as Claims
        val id = claims["id"]
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

    @PatchMapping(value = ["/{announcementId}"])
    fun partialUpdateUser(@PathVariable announcementId: String, @RequestBody patch: UpdateAnnouncementDto): ResponseEntity<ControllerResponse<Announcement>> {
        val claims = SecurityContextHolder.getContext().authentication.details as Claims
        val serviceResponse = service.updateAnnouncement(claims.get("id").toString(),announcementId ,patch)
        val response = ControllerResponse(
            data = serviceResponse.data,
            error = serviceResponse.error
        )
        return ResponseEntity(response, serviceResponse.code)
    }
}
