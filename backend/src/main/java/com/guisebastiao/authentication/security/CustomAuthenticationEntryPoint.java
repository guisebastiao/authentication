package com.guisebastiao.authentication.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.guisebastiao.authentication.dto.DefaultResponse;
import com.guisebastiao.authentication.util.CookieUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Autowired
    private CookieUtil cookieUtil;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException {
        DefaultResponse<Void> responseBody = new DefaultResponse<Void>(false, "Por favor, realize seu login", null);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.addCookie(cookieUtil.deleteCookie("access_token"));
        response.addCookie(cookieUtil.deleteCookie("refresh_token"));
        response.addCookie(cookieUtil.deleteCookie("access_token_expires"));
        response.addCookie(cookieUtil.deleteCookie("refresh_token_expires"));
        response.addCookie(cookieUtil.createSessionCookie("is_authenticated", Boolean.toString(false)));
        response.getWriter().write(new ObjectMapper().writeValueAsString(responseBody));
    }
}