package ru.atom.adboard.services

import org.apache.logging.log4j.LogManager
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import ru.atom.adboard.dal.entities.Category
import ru.atom.adboard.dal.repositories.CategoryRepository
import ru.atom.adboard.services.response.ServiceResponse
import ru.atom.adboard.services.security.SecureService
import java.util.*

@Service
class CategoryService(_repo: CategoryRepository)
{
    private val repo = _repo
    val logger = LogManager.getLogger(this.javaClass.name)
    fun getCategories() : ServiceResponse<List<Category>>
    {
        try {
            val categories = repo.findAll()
            return ServiceResponse(categories, HttpStatus.OK)
        }
        catch (ex: Exception) {
            logger.error("Getting categories exception: ${ex.message}")
            return ServiceResponse(HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }

    fun getCategory(id: String?): ServiceResponse<Category>
    {

        if(id.isNullOrEmpty() || !SecureService.isValidId(id))
            return ServiceResponse(HttpStatus.BAD_REQUEST)

        try {
            val categoryOptional = repo.findById(UUID.fromString(id))
            if(categoryOptional.isEmpty)
                return ServiceResponse(HttpStatus.NOT_FOUND)

            return ServiceResponse(categoryOptional.get(), HttpStatus.OK)
        }
        catch (ex: Exception) {
            logger.error("Getting category with id=${id} exception: ${ex.message}")
            return ServiceResponse(HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }
}
