package ru.atom.adboard.controllers

import org.springframework.http.*
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.servlet.support.ServletUriComponentsBuilder
import ru.atom.adboard.dal.entities.RefreshToken
import ru.atom.adboard.dal.entities.User
import ru.atom.adboard.dal.repositories.RefreshTokenRepository
import ru.atom.adboard.dal.repositories.UserRepository
import ru.atom.adboard.services.security.JwtUtil
import ru.atom.adboard.services.security.SecureService
import ru.atom.adboard.services.security.dtos.AuthResponse
import ru.atom.adboard.services.security.dtos.RegistrationRequest
import java.net.URI
import java.net.URL
import java.util.*

@RestController()
@RequestMapping("/api/users")
class UserController(_repo: UserRepository, _jwtUtil: JwtUtil, _refreshRepo: RefreshTokenRepository) {
    private final val repo: UserRepository = _repo;
    private final val jwtUtil = _jwtUtil
    private final val refRepo = _refreshRepo

    @PostMapping
    fun createUser(@RequestBody request: RegistrationRequest) : Any
    {
        val newPassword = SecureService.getBCryptHash(request.password).get()
        val user = User(request.email, newPassword, request.name)
        val accessToken = jwtUtil.generateAccessToken(user.email)
        val refreshToken = jwtUtil.generateRefreshToken(user.email)
        val userFromDb = repo.save(user)
        refRepo.save(
            RefreshToken(refreshToken, Date(System.currentTimeMillis() + jwtUtil.refreshTokenExpiration), userFromDb)
        )
        return ResponseEntity.ok(AuthResponse(accessToken,refreshToken));
    }

    @GetMapping("/{id}")
    fun getUser(@PathVariable id: UUID) : ResponseEntity<User>
    {
        return ResponseEntity.ok(repo.findById(id).get());
    }
}
