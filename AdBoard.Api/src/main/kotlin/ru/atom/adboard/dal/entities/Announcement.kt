package ru.atom.adboard.dal.entities

import com.fasterxml.jackson.annotation.JsonBackReference
import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*
import lombok.EqualsAndHashCode
import java.util.*
import kotlin.collections.HashSet

@Entity
@Table(name = "announcements")
@EqualsAndHashCode
data class Announcement(
    @Id
    @Column(name = "id", columnDefinition = "UUID")
    val id: UUID = UUID.randomUUID(),

    @Column(name = "creator_Id", columnDefinition = "UUID", nullable = false)
    val creatorId: UUID,

    @Column(name = "title", nullable = false)
    var title: String,

    @Column(name = "description")
    var description: String,

    @Column(name = "price", nullable = false)
    var price: Double,

    @Column(name = "city")
    var city: String,

    @Column(name = "count")
    var count: Int,

    @Column(name = "subcategory_id")
    @JsonIgnore
    val subcategoryId: UUID,

    @Column(name = "is_hidden", nullable = false)
    var isHidden: Boolean = false,

    @OneToMany(mappedBy = "announcement", cascade = [CascadeType.ALL], orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    val reviews: MutableSet<Review> = mutableSetOf(),

    @ManyToMany(mappedBy = "favorites")
    @JsonIgnore
    val favoritedBy: MutableSet<User> = HashSet(),

    @ManyToOne
    @JoinColumn(name = "subcategory_id", insertable = false, updatable = false)
    val subcategory: Subcategory? = null,

    @ManyToOne()
    @JsonIgnore
    @JoinColumn(name = "creator_Id", insertable = false, updatable = false)
    val creator: User? = null
)
{
    constructor(creatorId: UUID, title: String, description: String, price: Double, city: String, count: Int, subcategoryId: UUID)
            : this(UUID.randomUUID(), creatorId, title, description, price, city, count, subcategoryId)

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Announcement) return false
        return id == other.id
    }

    override fun hashCode(): Int = id.hashCode()
}
