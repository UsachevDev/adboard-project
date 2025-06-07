package ru.atom.adboard.dal.entities

import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "subcategories")
data class Subcategory(
    @Id
    @Column(name = "id", columnDefinition = "UUID")
    val id: UUID = UUID.randomUUID(),

    @Column(name = "name", nullable = false)
    val name: String,

    @Column(name = "category", nullable = false)
    val category: String,

    @ManyToMany(mappedBy = "subcategories")
    val announcements: MutableSet<Announcement> = mutableSetOf()
)
