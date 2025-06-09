package ru.atom.adboard.dal.entities

import jakarta.persistence.*
import lombok.Data
import org.hibernate.annotations.CreationTimestamp
import java.util.*

@Entity
@Table(name = "users")
data class User
(
    @Id
    @Column(name = "id", columnDefinition = "UUID")
    val id: UUID = UUID.randomUUID(),

    @Column(name = "email", nullable = false)
    var email: String,

    @Column(name = "password", nullable = false)
    var password: String,

    @Column(name = "createdAt", nullable = false)
    @CreationTimestamp
    val createdAt: Date,

    @Column(name = "name", nullable = false)
    var name: String,

    @Column(name = "phoneNumber")
    var phoneNumber: String?,

    @Column(name = "address")
    var address: String?,

    @OneToMany(mappedBy = "user", cascade = [CascadeType.ALL], orphanRemoval = true, fetch = FetchType.EAGER)
    val reviews: MutableList<Review> = mutableListOf(),

    @ManyToMany
    @JoinTable(
        name = "favorites",
        joinColumns = [JoinColumn(name = "user_id", referencedColumnName = "id")],
        inverseJoinColumns = [JoinColumn(name = "announcement_id", referencedColumnName = "id")]
    )
    val favorites: MutableSet<Announcement> = mutableSetOf()
)
