package ru.atom.adboard.dal.entities

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "reviews")
data class Review(
    @Id
    @Column(name = "id", columnDefinition = "UUID")
    val id: UUID = UUID.randomUUID(),

    @Column(name = "buyer_id")
    val buyerId: UUID,

    @Column(name = "seller_id")
    val sellerId: UUID,

    @Column(name = "announcement_id")
    val announcementId: UUID,

    @Column(name = "score")
    val score: Int,

    @Column(name = "description")
    val description: String,

    @ManyToOne()
    @JsonIgnore
    @JoinColumn(name = "announcement_id", insertable = false, updatable = false)
    val announcement: Announcement? = null,

    @ManyToOne()
    @JsonIgnore
    @JoinColumn(name = "buyer_id", insertable = false, updatable = false)
    val buyer: User? = null,

    @ManyToOne()
    @JsonIgnore
    @JoinColumn(name = "seller_id", insertable = false, updatable = false)
    val seller: User? = null
)
{
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Announcement) return false
        return id == other.id
    }

    override fun hashCode(): Int = id.hashCode()
}
