package ru.atom.adboard.services.response

import com.fasterxml.jackson.annotation.JsonInclude
import ru.atom.adboard.dal.entities.Review
import java.util.*

@JsonInclude(JsonInclude.Include.NON_NULL)
data class UserProfileDto
(
    val email: String?,
    val createdAt: Date,
    val name: String,
    val phoneNumber: String?,
    val city: String?,
    val reviews:  MutableList<Review>? = mutableListOf(),
    val userReviews: MutableList<Review>? = mutableListOf(),
)
{
    constructor(name: String, createdAt: Date, reviews: MutableList<Review>?) : this(null, createdAt, name, null,null,reviews,null)
}
