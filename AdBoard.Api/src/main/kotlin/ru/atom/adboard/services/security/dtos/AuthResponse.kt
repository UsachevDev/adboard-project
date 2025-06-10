package ru.atom.adboard.services.security.dtos

import lombok.Data

@Data
data class AuthResponse(
    val access_token: String,
    val refresh_token: String
)
