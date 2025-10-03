package com.guisebastiao.authentication.security;

import com.guisebastiao.authentication.entity.User;
import com.guisebastiao.authentication.enums.AuthenticationType;
import com.guisebastiao.authentication.repository.UserRepository;
import com.guisebastiao.authentication.util.CookieOptions;
import com.guisebastiao.authentication.util.CookieUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Component
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private CookieUtil cookieUtil;

    @Value("${access.token.duration}")
    private int accessTokenDuration;

    @Value("${refresh.token.duration}")
    private int refreshTokenDuration;

    @Value("${frontend.url}")
    private String frontendUrl;

    @Override
    @Transactional
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setName(name);
                    newUser.setAuthenticationType(AuthenticationType.GOOGLE);
                    return userRepository.save(newUser);
                });

        String accessToken = tokenService.generateAccessToken(user);
        String refreshToken = tokenService.generateRefreshToken(user);

        response.addCookie(cookieUtil.createCookie("access_token", accessToken, CookieOptions.builder().httpOnly(true).maxAge(Duration.ofSeconds(accessTokenDuration).getSeconds()).build()));
        response.addCookie(cookieUtil.createCookie("refresh_token", refreshToken, CookieOptions.builder().httpOnly(true).maxAge(Duration.ofSeconds(refreshTokenDuration).getSeconds()).build()));

        response.addCookie(cookieUtil.createSessionCookie("is_authenticated", Boolean.toString(true)));

        response.addCookie(cookieUtil.createSessionCookie("access_token_expires", Instant.now().plus(accessTokenDuration, ChronoUnit.SECONDS).toString()));
        response.addCookie(cookieUtil.createSessionCookie("refresh_token_expires", Instant.now().plus(refreshTokenDuration, ChronoUnit.SECONDS).toString()));

        response.sendRedirect(frontendUrl + "/callback.html");
    }
}