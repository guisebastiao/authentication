package com.guisebastiao.authentication.util;

import jakarta.servlet.http.Cookie;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
public class CookieUtil {
    public Cookie createCookie(String name, String value, CookieOptions options) {
        Cookie cookie = new Cookie(name, value);

        cookie.setHttpOnly(options.httpOnly());
        cookie.setSecure(options.secure());
        cookie.setPath(options.path());
        cookie.setMaxAge(options.maxAge());

        return cookie;
    }

    public Cookie createLongCookie(String name, String value) {
        long duration = Duration.ofDays(365).toSeconds();
        return createCookie(name, value, CookieOptions.builder().maxAge(duration).build());
    }

    public Cookie deleteCookie(String name) {
        return createCookie(name, null, CookieOptions.builder().maxAge(0).build());
    }
}
