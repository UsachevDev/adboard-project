package ru.atom.adboard.dal.entities

import jakarta.persistence.*
import lombok.Data
import java.util.*

@Entity
@Data
@Table(name = "refresh_tokens")
class RefreshToken (
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long,
    @Column(nullable = false, unique = true)
    var token: String,
    var expiryDate: Date,
    @OneToOne
    val user: User
)
{
    constructor(token: String, expiryDate: Date, user: User) : this(0, token, expiryDate, user)
}
