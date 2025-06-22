package ru.atom.adboard.services.request

data class UpdateAnnouncementDto(
    val title: String?,
    val description: String?,
    val price: Double?,
    val city: String?,
    val count: Int?,
    val isHidden: Boolean?
)
