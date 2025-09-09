package ru.atom.adboard.services.request

data class AddAnnouncementDto(
    val title: String,
    val description: String,
    val price: Double,
    val city: String?,
    val count: Int,
    val subcategoryId: String
)
