package ru.atom.adboard.dal.entities
import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "categories")
data class Category(
    @Id
    @Column(name = "id", columnDefinition = "UUID")
    val id: UUID = UUID.randomUUID(),

    @Column(name = "name", nullable = false)
    val name: String,

    @ManyToMany(mappedBy = "categories")
    val announcements: MutableSet<Announcement> = mutableSetOf()
)
