package com.guisebastiao.authentication.validation.passwordMather;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = {MatcherRegisterValidator.class, MatcherRecoverPassword.class})
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface PasswordMatches {
    String message() default "As senhas não coincidem";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
