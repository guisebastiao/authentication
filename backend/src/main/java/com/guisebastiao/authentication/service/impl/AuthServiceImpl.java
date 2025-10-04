package com.guisebastiao.authentication.service.impl;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.guisebastiao.authentication.dto.DefaultResponse;
import com.guisebastiao.authentication.dto.request.LoginRequest;
import com.guisebastiao.authentication.dto.request.RegisterRequest;
import com.guisebastiao.authentication.dto.response.LoginResponse;
import com.guisebastiao.authentication.dto.response.RegisterResponse;
import com.guisebastiao.authentication.entity.User;
import com.guisebastiao.authentication.enums.AuthenticationType;
import com.guisebastiao.authentication.mapper.UserMapper;
import com.guisebastiao.authentication.repository.UserRepository;
import com.guisebastiao.authentication.security.TokenService;
import com.guisebastiao.authentication.service.AuthService;
import com.guisebastiao.authentication.util.CookieOptions;
import com.guisebastiao.authentication.util.CookieUtil;
import com.guisebastiao.authentication.util.UUIDConverter;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private CookieUtil cookieUtil;

    @Value("${access.token.duration}")
    private int accessTokenDuration;

    @Value("${refresh.token.duration}")
    private int refreshTokenDuration;

    @Override
    @Transactional
    public DefaultResponse<LoginResponse> login(LoginRequest dto, HttpServletResponse res) {
        Optional<User> userExists = this.userRepository.findByEmail(dto.email());

        if(userExists.isPresent() && userExists.get().getAuthenticationType() == AuthenticationType.GOOGLE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Parece que você entrou com o Google da última vez");
        }

        UsernamePasswordAuthenticationToken userAndPass = new UsernamePasswordAuthenticationToken(dto.email(), dto.password());

        Authentication authentication = this.authenticationManager.authenticate(userAndPass);

        User user = (User) authentication.getPrincipal();

        String token = tokenService.generateAccessToken(user);
        String refreshToken = tokenService.generateRefreshToken(user);

        res.addCookie(cookieUtil.createCookie("access_token", token, CookieOptions.builder().httpOnly(true).maxAge(Duration.ofSeconds(accessTokenDuration).getSeconds()).build()));
        res.addCookie(cookieUtil.createCookie("refresh_token", refreshToken, CookieOptions.builder().httpOnly(true).maxAge(Duration.ofSeconds(refreshTokenDuration).getSeconds()).build()));

        res.addCookie(cookieUtil.createLongCookie("is_authenticated", Boolean.toString(true)));

        res.addCookie(cookieUtil.createLongCookie("access_token_expires", Instant.now().plus(accessTokenDuration, ChronoUnit.SECONDS).toString()));
        res.addCookie(cookieUtil.createLongCookie("refresh_token_expires", Instant.now().plus(refreshTokenDuration, ChronoUnit.SECONDS).toString()));

        LoginResponse data = new LoginResponse(user.getName(), user.getEmail());

        return new DefaultResponse<LoginResponse>(true, "Login efetuado com sucesso", data);
    }

    @Override
    @Transactional
    public DefaultResponse<RegisterResponse> register(RegisterRequest dto) {
        Optional<User> existsUser = this.userRepository.findByEmail(dto.email());

        if (existsUser.isPresent() && existsUser.get().getAuthenticationType() == AuthenticationType.LOCAL) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Essa conta já está cadastrada");
        }

        if(existsUser.isPresent()) {
            existsUser.get().setPassword(passwordEncoder.encode(dto.password()));
            existsUser.get().setName(dto.name());
            existsUser.get().setAuthenticationType(AuthenticationType.LOCAL);
            this.userRepository.save(existsUser.get());
        } else {
            User user = this.userMapper.toEntity(dto);
            user.setPassword(this.passwordEncoder.encode(dto.password()));
            user.setAuthenticationType(AuthenticationType.LOCAL);
            this.userRepository.save(user);
        }

        RegisterResponse data = new RegisterResponse(dto.name(), dto.email());

        return new DefaultResponse<RegisterResponse>(true, "Cadastro efetuado com sucesso", data);
    }

    @Override
    @Transactional
    public DefaultResponse<Void> refresh(HttpServletRequest req, HttpServletResponse res) {
        String token = this.getRefreshToken(req)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Refresh token não encontrado"));

        Optional<DecodedJWT> decoded = this.tokenService.validateToken(token);

        if (decoded.isEmpty() || !"refresh".equals(decoded.get().getClaim("type").asString())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token inválido");
        }

        UUID userId = UUIDConverter.toUUID(decoded.get().getClaim("userId").asString());

        User user = this.userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        String tokenExpires = Instant.now().plus(accessTokenDuration, ChronoUnit.SECONDS).toString();
        String newAccessToken = this.tokenService.generateAccessToken(user);

        res.addCookie(cookieUtil.createCookie("access_token", token, CookieOptions.builder().httpOnly(true).maxAge(Duration.ofSeconds(accessTokenDuration).getSeconds()).build()));
        res.addCookie(cookieUtil.createLongCookie("access_token_expires", Instant.now().plus(accessTokenDuration, ChronoUnit.SECONDS).toString()));
        res.addCookie(cookieUtil.createLongCookie("is_authenticated", Boolean.toString(true)));

        return new DefaultResponse<Void>(true, "Refresh token efetuado com sucesso", null);
    }

    @Override
    public DefaultResponse<Void> logout(HttpServletResponse res) {
        res.addCookie(cookieUtil.deleteCookie("access_token"));
        res.addCookie(cookieUtil.deleteCookie("refresh_token"));
        res.addCookie(cookieUtil.deleteCookie("access_token_expires"));
        res.addCookie(cookieUtil.deleteCookie("refresh_token_expires"));
        res.addCookie(cookieUtil.createLongCookie("is_authenticated", Boolean.toString(false)));

        return new DefaultResponse<Void>(true, "Logout efetuado com sucesso", null);
    }

    private Optional<String> getRefreshToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        if(cookies == null) return Optional.empty();

        return Arrays.stream(cookies)
                .filter(cookie -> "refresh_token".equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst();
    }
}
