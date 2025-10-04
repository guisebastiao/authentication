package com.guisebastiao.authentication.dto.request;

import com.guisebastiao.authentication.validation.passwordMather.PasswordMatches;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

@PasswordMatches
public record RecoverPasswordRequest(
        @NotEmpty(message = "Informe sua nova senha")
        @Size(min = 6, max = 20, message = "Sua nova senha deve entre 6 a 20 caracteres")
        String newPassword,

        @NotEmpty(message = "Confirme sua nova senha")
        @Size(min = 6, max = 20, message = "Sua nova senha deve entre 6 a 20 caracteres")
        String confirmPassword
) { }