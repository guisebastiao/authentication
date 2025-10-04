package com.guisebastiao.authentication.validation.passwordMather;

import com.guisebastiao.authentication.dto.request.RegisterRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class MatcherRegisterValidator implements ConstraintValidator<PasswordMatches, RegisterRequest> {

    @Override
    public boolean isValid(RegisterRequest dto, ConstraintValidatorContext context) {
        if (dto == null) return true;

        boolean valid = dto.password().equals(dto.confirmPassword());

        if (!valid) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("As senhas não coincidem").addPropertyNode("confirmPassword").addConstraintViolation();
        }

        return valid;
    }
}
