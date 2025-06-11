package ru.atom.adboard.services.response

import lombok.Data

@Data
data class TokensDto(
    val access_token: String,
    val refresh_token: String
)
