package ru.atom.adboard.dal.entities

import jakarta.persistence.*
import java.util.*

@Entity
@Table(name = "reviews")
data class Review(
    @Id
    @Column(name = "id", columnDefinition = "UUID")
    val id: UUID = UUID.randomUUID(),

    @Column(name = "buyerId", columnDefinition = "UUID")
    val buyerId: UUID,

    @Column(name = "sellerId", columnDefinition = "UUID")
    val sellerId: UUID,

    @Column(name = "score")
    val score: Int,

    @Column(name = "description")
    val description: String,

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,

    @ManyToOne
    @JoinColumn(name = "announcement_id", nullable = false)
    val announcement: Announcement
)
