package com.guisebastiao.authentication.dto;

public record FieldErrorResponse(
        String field,
        String error
) { }
