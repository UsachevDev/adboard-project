package ru.atom.adboard.dal.entities

import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "announcements")
data class Announcement(
    @Id
    @Column(name = "id", columnDefinition = "UUID")
    val id: UUID = UUID.randomUUID(),

    @Column(name = "creator_Id", columnDefinition = "UUID", nullable = false)
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

    @Column(name = "subcategory_id")
    val subcategoryId: UUID,

    @OneToMany(mappedBy = "announcement", cascade = [CascadeType.ALL], orphanRemoval = true, fetch = FetchType.LAZY)
    val reviews: MutableList<Review> = mutableListOf(),

    @ManyToMany(mappedBy = "favorites", fetch = FetchType.LAZY)
    val favoritedBy: MutableSet<User> = mutableSetOf(),

    @ManyToOne
    @JoinColumn(name = "subcategory_id", insertable = false, updatable = false)
    val subcategory: Subcategory? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_Id", insertable = false, updatable = false)
    val creator: User? = null
)
{
    constructor(creatorId: UUID, title: String, description: String, price: Double, city: String, count: Int, subcategoryId: UUID)
            : this(UUID.randomUUID(), creatorId, title, description, price, city, count, subcategoryId)
}
