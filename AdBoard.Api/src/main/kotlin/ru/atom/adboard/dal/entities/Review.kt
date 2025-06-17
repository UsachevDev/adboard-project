package ru.atom.adboard.dal.entities

import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "reviews")
data class Review(
    @Id
    @Column(name = "id", columnDefinition = "UUID")
    val id: UUID = UUID.randomUUID(),

    @ManyToOne
    @JoinColumn(name = "buyer_Id", nullable = false, columnDefinition = "UUID")
    val buyerId: User,

    @ManyToOne
    @JoinColumn(name = "seller_Id", nullable = false, columnDefinition = "UUID")
    val sellerId: User,

    @Column(name = "score")
    val score: Int,

    @Column(name = "description")
    val description: String,

    @ManyToOne
    @JoinColumn(name = "announcement_id", nullable = false)
    val announcement: Announcement
)
