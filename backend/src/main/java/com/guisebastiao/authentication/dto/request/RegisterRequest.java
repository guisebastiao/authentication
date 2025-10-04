package com.guisebastiao.authentication.dto.request;

import com.guisebastiao.authentication.validation.passwordMather.PasswordMatches;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

@PasswordMatches
public record RegisterRequest(
        @NotEmpty(message = "Informe seu nome")
        @Size(max = 255, message = "Seu nome tem que ser menor que 255 caracteres")
        String name,

        @NotEmpty(message = "Informe seu email")
        @Email(message = "Informe um email válido")
        @Size(max = 255, message = "Seu email tem que ser menor que 255 caracteres")
        String email,

        @NotEmpty(message = "Informe sua senha")
        @Size(min = 6, max = 20, message = "Sua senha tem possuir entre 6 a 20 caracteres")
        String password,

        @NotEmpty(message = "Confirme sua nova senha")
        @Size(min = 6, max = 20, message = "Sua senha deve entre 6 a 20 caracteres")
        String confirmPassword
) { }
