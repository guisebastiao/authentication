package com.guisebastiao.authentication.repository;

import com.guisebastiao.authentication.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<UserDetails> findUserByEmail(String username);
    Optional<User> findByEmail(String email);
}
