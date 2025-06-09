package ru.atom.adboard.services.security

import org.slf4j.LoggerFactory
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import java.util.*

object SecureService
{
    private val encoder: BCryptPasswordEncoder = BCryptPasswordEncoder(10)
    private val logger = LoggerFactory.getLogger(javaClass.name)

    @JvmStatic
    fun getBCryptHash(data: String) : Optional<String>
    {
        try
        {
            return Optional.of(encoder.encode(data))
        }
        catch (ex: Exception)
        {
            logger.error("Getting BCrypt hash error: ${ex.message}")
            return Optional.empty()
        }
    }

    @JvmStatic
    fun validateBCryptHash(data: String, hash: String) : Boolean
    {
        return encoder.matches(data,hash)
    }



}
