package ru.atom.adboard.dal.repositories

import org.springframework.data.jpa.repository.JpaRepository
import ru.atom.adboard.dal.entities.Announcement
import java.util.UUID

interface AnnouncementRepository : JpaRepository<Announcement, UUID> {
}
