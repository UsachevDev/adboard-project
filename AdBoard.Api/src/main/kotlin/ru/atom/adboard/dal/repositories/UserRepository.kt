package ru.atom.adboard.dal.repositories

import org.springframework.data.jpa.repository.JpaRepository
import ru.atom.adboard.dal.entities.User
import java.util.*

interface UserRepository : JpaRepository<User, UUID>
{
    fun findUserByEmail(email: String) : Optional<User>
    fun findUserById(id: UUID): Optional<User>
    fun existsUserByEmail(email:String): Boolean
}
