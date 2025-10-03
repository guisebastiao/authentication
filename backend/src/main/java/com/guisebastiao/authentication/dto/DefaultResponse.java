package com.guisebastiao.authentication.dto;

public record DefaultResponse<T>(
        boolean success,
        String message,
        T data
) { }
