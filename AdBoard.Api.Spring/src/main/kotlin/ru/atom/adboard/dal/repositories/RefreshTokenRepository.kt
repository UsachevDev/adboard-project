package ru.atom.adboard.dal.repositories

import org.springframework.data.jpa.repository.JpaRepository
import ru.atom.adboard.dal.entities.RefreshToken
import java.util.Optional

interface RefreshTokenRepository : JpaRepository<RefreshToken, Long>
{
    fun findByToken(token: String) : Optional<RefreshToken>
    fun findByUser_Email(email: String): Optional<RefreshToken>
}
