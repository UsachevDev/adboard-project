package ru.atom.adboard.controllers

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import ru.atom.adboard.dal.entities.Category
import ru.atom.adboard.services.CategoryService

@RestController
@RequestMapping("/api/categories")
class CategoryController(private val service: CategoryService)
{
    @GetMapping
    fun getCategories() : ResponseEntity<ControllerResponse<List<Category>>>
    {
        val serviceResponse =  service.getCategories()
        return ResponseEntity(
            ControllerResponse(serviceResponse.data, serviceResponse.error),
            serviceResponse.code
        )
    }

    @GetMapping("/{id}")
    fun getCategory(@PathVariable id: String?) : ResponseEntity<ControllerResponse<Category>>
    {
        val serviceResponse =  service.getCategory(id)
        return ResponseEntity(
            ControllerResponse(serviceResponse.data, serviceResponse.error),
            serviceResponse.code
        )
    }
}
