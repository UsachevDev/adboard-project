package ru.atom.adboard.services

import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import ru.atom.adboard.dal.entities.User
import ru.atom.adboard.dal.repositories.UserRepository

@Service
class UserService(_repo: UserRepository)
{
}
