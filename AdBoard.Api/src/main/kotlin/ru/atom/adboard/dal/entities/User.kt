package ru.atom.adboard.dal.entities

import com.fasterxml.jackson.annotation.JsonManagedReference
import jakarta.persistence.*
import org.springframework.data.annotation.CreatedDate
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import java.util.*
import kotlin.collections.HashSet

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

    @OneToMany(mappedBy = "creator", fetch = FetchType.EAGER)
    val announcements: MutableSet<Announcement> = mutableSetOf(),

    @OneToMany(mappedBy = "buyerId", cascade = [CascadeType.ALL], orphanRemoval = true, fetch = FetchType.EAGER)
    val userReviews: MutableList<Review> = mutableListOf(),
    @ManyToMany(fetch = FetchType.EAGER, cascade = [CascadeType.PERSIST, CascadeType.MERGE])
    @JoinTable(
        name = "favorites",
        joinColumns = [JoinColumn(name = "user_id", referencedColumnName = "id")],
        inverseJoinColumns = [JoinColumn(name = "announcement_id", referencedColumnName = "id")]
    )
    val favorites: MutableSet<Announcement> = HashSet()
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

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Announcement) return false
        return id == other.id
    }

    override fun hashCode(): Int = id.hashCode()
}
