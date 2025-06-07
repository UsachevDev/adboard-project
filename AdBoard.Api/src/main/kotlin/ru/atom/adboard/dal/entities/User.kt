package ru.atom.adboard.dal.entities

import jakarta.annotation.Nullable
import jakarta.persistence.*
import lombok.Data
import lombok.NoArgsConstructor
import java.util.*

@Entity
@Table(name = "users")
data class User
(
    @Id
    @Column(name = "id", columnDefinition = "UUID")
    val id: UUID = UUID.randomUUID(),

    @Column(name = "email", nullable = false)
    val email: String,

    @Column(name = "password", nullable = false)
    val password: String,

    @Column(name = "createdAt", nullable = false)
    val createdAt: Date,

    @Column(name = "name", nullable = false)
    val name: String,

    @Column(name = "phoneNumber")
    val phoneNumber: String?,

    @Column(name = "address")
    val address: String?,

    @OneToMany(mappedBy = "user", cascade = [CascadeType.ALL], orphanRemoval = true)
    val reviews: MutableList<Review> = mutableListOf(),

    @ManyToMany
    @JoinTable(
        name = "favorites",
        joinColumns = [JoinColumn(name = "user_id", referencedColumnName = "id")],
        inverseJoinColumns = [JoinColumn(name = "announcement_id", referencedColumnName = "id")]
    )
    val favorites: MutableSet<Announcement> = mutableSetOf()
)
