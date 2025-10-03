package com.guisebastiao.authentication.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.guisebastiao.authentication.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Component
public class TokenService {

    @Value("${token.secret}")
    private String secret;

    @Value("${access.token.duration}")
    private int accessTokenDuration;

    @Value("${refresh.token.duration}")
    private int refreshTokenDuration;

    public String generateAccessToken(User user) {
            Algorithm algorithm = Algorithm.HMAC256(this.secret);

            return JWT.create()
                    .withClaim("userId", user.getId().toString())
                    .withSubject(user.getEmail())
                    .withExpiresAt(Instant.now().plus(accessTokenDuration, ChronoUnit.SECONDS))
                    .withIssuedAt(Instant.now())
                    .sign(algorithm);
    }

    public String generateRefreshToken(User user) {
        Algorithm algorithm = Algorithm.HMAC256(this.secret);

        return JWT.create()
                .withClaim("type", "refresh")
                .withClaim("userId", user.getId().toString())
                .withSubject(user.getEmail())
                .withExpiresAt(Instant.now().plus(refreshTokenDuration, ChronoUnit.SECONDS))
                .withIssuedAt(Instant.now())
                .sign(algorithm);
    }

    public Optional<DecodedJWT> validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(this.secret);
            DecodedJWT decodedJWT = JWT.require(algorithm).build().verify(token);
            return Optional.of(decodedJWT);
        } catch (JWTVerificationException ex) {
            return Optional.empty();
        }
    }
}
