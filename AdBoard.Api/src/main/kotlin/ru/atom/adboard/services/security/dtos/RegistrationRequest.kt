package ru.atom.adboard.services.security.dtos

data class RegistrationRequest(
    val email: String,
    val password: String,
    val name: String
)
