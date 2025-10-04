package com.guisebastiao.authentication.repository;

import com.guisebastiao.authentication.entity.RecoverPassword;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

public interface RecoverPasswordRepository extends JpaRepository<RecoverPassword, UUID> {
    Optional<RecoverPassword> findByRecoverToken(UUID recoverToken);

    @Modifying
    @Query("DELETE FROM RecoverPassword rp WHERE rp.user.id = :userId")
    void deleteByUserId(@Param("userId") UUID userId);

    @Modifying
    @Query("DELETE FROM RecoverPassword rp WHERE rp.expiresToken < :now")
    void deleteAllByRecoverPasswordExpired(@Param("now") LocalDateTime now);
}
