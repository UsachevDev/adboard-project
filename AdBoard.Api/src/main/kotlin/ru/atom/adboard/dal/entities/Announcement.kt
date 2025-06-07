package ru.atom.adboard.dal.entities

import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "announcements")
data class Announcement(
    @Id
    @Column(name = "id", columnDefinition = "UUID")
    val id: UUID = UUID.randomUUID(),

    @Column(name = "creatorId", columnDefinition = "UUID", nullable = false)
    val creatorId: UUID,

    @Column(name = "title", nullable = false)
    val title: String,

    @Column(name = "description")
    val description: String,

    @Column(name = "price", nullable = false)
    val price: Double,

    @Column(name = "city")
    val city: String,

    @Column(name = "count")
    val count: Int,

    @OneToMany(mappedBy = "announcement", cascade = [CascadeType.ALL], orphanRemoval = true)
    val reviews: MutableList<Review> = mutableListOf(),

    @ManyToMany(mappedBy = "favorites")
    val favoritedBy: MutableSet<User> = mutableSetOf(),

    @ManyToMany
    @JoinTable(
        name = "announcements_category",
        joinColumns = [JoinColumn(name = "announcement_id", referencedColumnName = "id")],
        inverseJoinColumns = [JoinColumn(name = "category_id", referencedColumnName = "id")]
    )
    val categories: MutableSet<Category> = mutableSetOf(),

    @ManyToMany
    @JoinTable(
        name = "announcements_subcategory",
        joinColumns = [JoinColumn(name = "announcement_id", referencedColumnName = "id")],
        inverseJoinColumns = [JoinColumn(name = "subcategory_id", referencedColumnName = "id")]
    )
    val subcategories: MutableSet<Subcategory> = mutableSetOf(),
)
