package ru.atom.adboard.services.request

data class RegistrationRequest(
    val email: String,
    val password: String,
    val name: String,
    val phoneNumber: String?,
    val city: String?
)
