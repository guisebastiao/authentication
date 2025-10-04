package com.guisebastiao.authentication.validation.passwordMather;

import com.guisebastiao.authentication.dto.request.RecoverPasswordRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class MatcherRecoverPassword implements ConstraintValidator<PasswordMatches, RecoverPasswordRequest> {

    @Override
    public boolean isValid(RecoverPasswordRequest dto, ConstraintValidatorContext context) {
        if (dto == null) return true;

        boolean valid = dto.newPassword().equals(dto.confirmPassword());

        if (!valid) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("As senhas não coincidem").addPropertyNode("confirmPassword").addConstraintViolation();
        }

        return valid;
    }
}
