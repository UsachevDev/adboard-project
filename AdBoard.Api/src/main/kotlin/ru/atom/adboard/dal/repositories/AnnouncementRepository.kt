package ru.atom.adboard.dal.repositories

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import ru.atom.adboard.dal.entities.Announcement
import java.util.UUID

interface AnnouncementRepository : JpaRepository<Announcement, UUID> {
    fun findAllByIsHiddenFalse(): List<Announcement>

    @Query("SELECT a FROM Announcement a JOIN FETCH a.subcategory s JOIN FETCH s.category WHERE a.isHidden = false")
    fun findAllByIsHiddenFalseWithSubcategoryAndCategory(): List<Announcement>

}
