package com.guisebastiao.authentication.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public record CreateRecoverPasswordRequest(
        @NotEmpty(message = "Informe seu email")
        @Email(message = "Informe um email inválido")
        @Size(max = 255, message = "Seu email tem que ser menor que 255 caracteres")
        String email
) { }
