package com.guisebastiao.authentication.security;

import com.guisebastiao.authentication.util.CookieUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
public class CustomAuthenticationFailureHandler implements AuthenticationFailureHandler {

    @Autowired
    private CookieUtil cookieUtil;

    @Value("${frontend.url}")
    private String frontendUrl;

    @Override
    @Transactional
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException {
        response.addCookie(cookieUtil.deleteCookie("access_token"));
        response.addCookie(cookieUtil.deleteCookie("refresh_token"));
        response.addCookie(cookieUtil.deleteCookie("access_token_expires"));
        response.addCookie(cookieUtil.deleteCookie("refresh_token_expires"));
        response.addCookie(cookieUtil.createLongCookie("is_authenticated", Boolean.toString(false)));

        String targetUrl = this.buildRedirectUrl();
        response.sendRedirect(targetUrl);
    }

    private String buildRedirectUrl() {
        return UriComponentsBuilder.fromHttpUrl(frontendUrl).path("/oauth2/callback").queryParam("success", false).build().toUriString();
    }
}