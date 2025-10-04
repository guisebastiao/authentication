package com.guisebastiao.authentication.service.impl;

import com.guisebastiao.authentication.config.RabbitMQConfig;
import com.guisebastiao.authentication.dto.MailDTO;
import com.guisebastiao.authentication.service.MailService;
import jakarta.mail.internet.MimeMessage;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class MailServiceImpl implements MailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Value("${spring.mail.username}")
    private String from;

    @Override
    public void sendMail(MailDTO mailDTO) {
        rabbitTemplate.convertAndSend(RabbitMQConfig.QUEUE_EMAILS, mailDTO);
    }

    @RabbitListener(queues = RabbitMQConfig.QUEUE_EMAILS)
    public void consumer(MailDTO mailDTO) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(from);
            helper.setTo(mailDTO.to());
            helper.setSubject(mailDTO.subject());
            helper.setText(mailDTO.template(), true);

            mailSender.send(mimeMessage);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
