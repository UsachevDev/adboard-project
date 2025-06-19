package ru.atom.adboard.controllers

import io.jsonwebtoken.Claims
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.ExampleObject
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.*
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*
import ru.atom.adboard.dal.entities.User

import ru.atom.adboard.services.UserService
import ru.atom.adboard.services.response.UserUpdateDto
import java.util.*

@RestController()
@RequestMapping("/api/users")
class UserController(_service: UserService)
{
    private final val service = _service
    @GetMapping(value = ["","/","/{id}"])
    fun getUser(@PathVariable id: String?) : ResponseEntity<Any>
    {
        val serviceResponse =  service.getUser(id, SecurityContextHolder.getContext().authentication)
        return ResponseEntity(
            ControllerResponse(serviceResponse.data, serviceResponse.error),
            serviceResponse.code
        )
    }

    @Operation(summary = "Partially update a user", description = "Update specific fields of a user by ID")
    @ApiResponses(value = [
        ApiResponse(
            responseCode = "200",
            description = "Successful partial update",
            content = [Content(
                mediaType = "application/json",
                schema = Schema(
                    implementation = ControllerResponse::class,
                    requiredProperties = ["data"],
                    description = "Partially updated user"
                ),
                examples = [ExampleObject(
                    value = ""
                )]
            )]
        ),
        ApiResponse(
            responseCode = "400",
            description = "Bad request (invalid field)",
            content = [Content(
                mediaType = "application/json",
                schema = Schema(
                    implementation = ControllerResponse::class,
                    requiredProperties = ["error"],
                    description = "Response with validation errors"
                )
            )]
        ),
        ApiResponse(
            responseCode = "401",
            description = "Unauthorized",
            content = [Content(
                mediaType = "application/json",
                schema = Schema(
                    implementation = ControllerResponse::class,
                )
            )]
        ),
        ApiResponse(
            responseCode = "500",
            description = "Internal server error",
            content = [Content(
                mediaType = "application/json",
                schema = Schema(
                    implementation = ControllerResponse::class,
                )
            )]
        )
    ])
    @PatchMapping(value = ["", "/"])
    fun partialUpdateUser(@RequestBody patch: UserUpdateDto): ResponseEntity<ControllerResponse<User>> {
        val claims = SecurityContextHolder.getContext().authentication.details as Claims
        val serviceResponse = service.updateUser(claims.get("id").toString(), patch)
        val response = ControllerResponse(
            data = serviceResponse.data,
            error = serviceResponse.error
        )
        return ResponseEntity(response, serviceResponse.code)
    }


}
