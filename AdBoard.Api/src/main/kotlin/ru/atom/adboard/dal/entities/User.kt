package ru.atom.adboard.dal.entities

import jakarta.persistence.*
import org.springframework.data.annotation.CreatedDate
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
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
    @get:JvmName("getRawPassword")
    var password: String,

    @Column(name = "createdAt")
    @CreatedDate
    val createdAt: Date,

    @Column(name = "name", nullable = false)
    var name: String,

    @Column(name = "phoneNumber")
    var phoneNumber: String?,

    @Column(name = "address")
    var city: String?,

    @OneToMany(mappedBy = "sellerId", cascade = [CascadeType.ALL], orphanRemoval = true, fetch = FetchType.EAGER)
    val reviews: MutableList<Review> = mutableListOf(),

    @OneToMany(mappedBy = "creator")
    val announcements: List<Announcement> = Collections.emptyList(),

    @OneToMany(mappedBy = "buyerId", cascade = [CascadeType.ALL], orphanRemoval = true, fetch = FetchType.EAGER)
    val userReviews: MutableList<Review> = mutableListOf(),
    @ManyToMany
    @JoinTable(
        name = "favorites",
        joinColumns = [JoinColumn(name = "user_id", referencedColumnName = "id")],
        inverseJoinColumns = [JoinColumn(name = "announcement_id", referencedColumnName = "id")]
    )
    val favorites: MutableSet<Announcement> = mutableSetOf()
) : UserDetails {
    constructor(email: String, password: String, name: String, phoneNumber: String?, city: String?) : this(UUID.randomUUID(), email, password, Date(), name, phoneNumber, city)
    constructor(email: String, password: String, name: String) : this(UUID.randomUUID(), email, password, Date(), name, null, null)

    override fun getAuthorities(): MutableCollection<out GrantedAuthority> {
        return mutableListOf()
    }

    override fun getPassword(): String {
        return password
    }

    override fun getUsername(): String {
        return email;
    }
}
