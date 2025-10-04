package com.guisebastiao.authentication.dto;

public record MailDTO(
        String to,
        String subject,
        String template
) { }