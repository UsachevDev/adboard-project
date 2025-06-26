package ru.atom.adboard.dal.repositories

import org.springframework.data.jpa.repository.EntityGraph
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import ru.atom.adboard.dal.entities.Category
import java.util.*

@Repository
interface CategoryRepository : JpaRepository<Category, UUID>
{
}
