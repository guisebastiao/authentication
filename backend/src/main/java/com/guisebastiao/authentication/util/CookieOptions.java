package com.guisebastiao.authentication.util;

public record CookieOptions(boolean httpOnly, boolean secure, String path, int maxAge) {
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private boolean httpOnly = false;
        private boolean secure = false;
        private String path = "/";
        private int maxAge = -1;

        public Builder httpOnly(boolean httpOnly) {
            this.httpOnly = httpOnly;
            return this;
        }

        public Builder secure(boolean secure) {
            this.secure = secure;
            return this;
        }

        public Builder path(String path) {
            this.path = path;
            return this;
        }

        public Builder maxAge(long seconds) {
            this.maxAge = (int) seconds;
            return this;
        }

        public CookieOptions build() {
            return new CookieOptions(httpOnly, secure, path, maxAge);
        }
    }
}