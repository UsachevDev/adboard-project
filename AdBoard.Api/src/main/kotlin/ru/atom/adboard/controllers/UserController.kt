package ru.atom.adboard.controllers

import org.springframework.http.*
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable

import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

import ru.atom.adboard.services.UserService
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


}
