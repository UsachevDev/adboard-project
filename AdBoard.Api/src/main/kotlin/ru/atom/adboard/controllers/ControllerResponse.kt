package ru.atom.adboard.controllers

import com.fasterxml.jackson.annotation.JsonInclude
import ru.atom.adboard.services.response.ServiceError

@JsonInclude(JsonInclude.Include.NON_NULL)
data class ControllerResponse<T> (
    val data: T?,
    val error: ServiceError?
)
