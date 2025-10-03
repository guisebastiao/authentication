package com.guisebastiao.authentication.security;

import com.auth0.jwt.interfaces.DecodedJWT;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token = this.recoverToken(request);

        Optional<DecodedJWT> validateAndDecoded = this.tokenService.validateToken(token);

        if (validateAndDecoded.isEmpty()) {
            filterChain.doFilter(request, response);
            return;
        }

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(validateAndDecoded.get().getClaim("userId"), null, Collections.emptyList());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        filterChain.doFilter(request, response);
    }

    private String recoverToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        if(cookies == null) return null;

        return Arrays.stream(cookies)
                .filter(cookie -> "access_token".equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }
}
