package ru.atom.adboard.services.response

data class UserUpdateDto(
    val password: String?,
    val name: String?,
    val phoneNumber: String?,
    val city: String?,
)
