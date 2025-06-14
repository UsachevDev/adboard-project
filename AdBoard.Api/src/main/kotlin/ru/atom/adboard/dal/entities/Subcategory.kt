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

    @ManyToOne
    @JoinColumn(name = "category_id")
    val category: Category,

    @OneToMany(mappedBy = "subcategory")
    val announcements: MutableSet<Announcement> = mutableSetOf()
)
