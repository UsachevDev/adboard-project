package ru.atom.adboard.services.security.dtos

data class AuthRequest(
    val email: String,
    val password: String
)
