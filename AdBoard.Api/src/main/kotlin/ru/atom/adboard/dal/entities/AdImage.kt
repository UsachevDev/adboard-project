package ru.atom.adboard.dal.entities

import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "images")
data class AdImage (
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID = UUID.randomUUID(),

    @Column(nullable = false)
    val fileName: String,

    @Column(nullable = false)
    val url: String,

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "announcement_id", nullable = false)
    val announcement: Announcement
)
{
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Announcement) return false
        return id == other.id
    }

    override fun hashCode(): Int = id.hashCode()
}
