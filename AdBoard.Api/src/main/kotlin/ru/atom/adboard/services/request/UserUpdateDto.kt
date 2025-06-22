package ru.atom.adboard.services.request

data class UserUpdateDto(
    val password: String?,
    val name: String?,
    val phoneNumber: String?,
    val city: String?,
)
