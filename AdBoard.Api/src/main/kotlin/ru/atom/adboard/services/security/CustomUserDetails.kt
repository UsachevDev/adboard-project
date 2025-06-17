package ru.atom.adboard.services.security

import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service
import ru.atom.adboard.dal.repositories.UserRepository

@Service
class CustomUserDetails(_repo: UserRepository) : UserDetailsService {
    private val repo = _repo
    override fun loadUserByUsername(email: String?): UserDetails
    {
        if(email == null) throw UsernameNotFoundException("")
        val user = repo.findUserByEmail(email)
        if(user.isPresent)
            return user.get()
        throw UsernameNotFoundException("User not found with email: ${email}")
    }
}
