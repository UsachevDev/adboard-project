package ru.atom.adboard.services.response

import com.fasterxml.jackson.annotation.JsonInclude
import org.springframework.http.HttpStatus

@JsonInclude(JsonInclude.Include.NON_NULL)
data class ServiceResponse(
    var data: Any?,
    var code: HttpStatus,
    var error: ServiceError?
) {
    constructor(data: Any?, code: HttpStatus) : this(data, code, null)
    constructor(code: HttpStatus, error: ServiceError?) : this(null, code, error)
    constructor(code: HttpStatus) : this(null,code,null)
}
