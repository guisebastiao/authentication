package com.guisebastiao.authentication.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "recover_passwords")
public class RecoverPassword {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "recover_token", nullable = false, unique = true)
    private UUID recoverToken;

    @Column(name = "expires_token", nullable = false)
    private LocalDateTime expiresToken;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
