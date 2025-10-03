package com.guisebastiao.authentication.util;

import jakarta.servlet.http.Cookie;
import org.springframework.stereotype.Component;

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

    public Cookie createSessionCookie(String name, String value) {
        return createCookie(name, value, CookieOptions.builder().maxAge(-1).build());
    }

    public Cookie deleteCookie(String name) {
        return createCookie(name, null, CookieOptions.builder().maxAge(0).build());
    }
}
