package com.guisebastiao.authentication.service.impl;

import com.guisebastiao.authentication.dto.DefaultResponse;
import com.guisebastiao.authentication.dto.MailDTO;
import com.guisebastiao.authentication.dto.request.CreateRecoverPasswordRequest;
import com.guisebastiao.authentication.dto.request.RecoverPasswordRequest;
import com.guisebastiao.authentication.entity.RecoverPassword;
import com.guisebastiao.authentication.entity.User;
import com.guisebastiao.authentication.enums.AuthenticationType;
import com.guisebastiao.authentication.repository.RecoverPasswordRepository;
import com.guisebastiao.authentication.repository.UserRepository;
import com.guisebastiao.authentication.service.MailService;
import com.guisebastiao.authentication.service.RecoverPasswordService;
import com.guisebastiao.authentication.util.UUIDConverter;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class RecoverPasswordServiceImpl implements RecoverPasswordService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RecoverPasswordRepository recoverPasswordRepository;

    @Autowired
    private MailService mailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TemplateEngine templateEngine;

    @Value("${frontend.url}")
    private String frontendUrl;

    @Override
    @Transactional
    public DefaultResponse<Void> createRecoverPassword(CreateRecoverPasswordRequest dto) {
        Optional<User> existsUser = this.userRepository.findByEmail(dto.email());

        if(existsUser.isPresent() && existsUser.get().getAuthenticationType() == AuthenticationType.GOOGLE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Parece que você entrou com o Google da última vez");
        }

        if (existsUser.isPresent()) {
            User user = existsUser.get();

            this.recoverPasswordRepository.deleteByUserId(user.getId());

            LocalDateTime expiresToken = LocalDateTime.now().plusMinutes(15);
            UUID recoverToken = UUID.randomUUID();

            RecoverPassword recoverPassword = new RecoverPassword();
            recoverPassword.setUser(user);
            recoverPassword.setRecoverToken(recoverToken);
            recoverPassword.setExpiresToken(expiresToken);

            this.recoverPasswordRepository.save(recoverPassword);

            String template = this.templateMail(this.generateLink(recoverToken.toString()));

            String subject = "Recuperar Senha";
            MailDTO mailDTO = new MailDTO(user.getEmail(), subject, template);

            this.mailService.sendMail(mailDTO);
        }

        return new DefaultResponse<Void>(true, "Se este e-mail estiver cadastrado, enviaremos instruções de recuperação", null);
    }

    @Override
    @Transactional
    public DefaultResponse<Void> resetPassword(String recoverToken, RecoverPasswordRequest dto) {
        RecoverPassword recoverPassword = this.findRecoverPasswordByCode(UUIDConverter.toUUID(recoverToken));

        User user = recoverPassword.getUser();
        user.setPassword(this.passwordEncoder.encode(dto.newPassword()));
        user.setRecoverPassword(null);

        this.userRepository.save(user);

        this.recoverPasswordRepository.delete(recoverPassword);

        return new DefaultResponse<Void>(true, "Sua senha foi recuperada com sucesso", null);
    }

    private RecoverPassword findRecoverPasswordByCode(UUID recoverToken) {
        return this.recoverPasswordRepository.findByRecoverToken(recoverToken)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "A recuperação da senha se expirou ou já foi alterada"));
    }

    private String templateMail(String link) {
        Context context = new Context();
        context.setVariable("link", link);
        return this.templateEngine.process("recover-password-template", context);
    }

    private String generateLink(String recoverToken) {
        return String.format(this.frontendUrl + "/recover-password/" + recoverToken);
    }
}
