package com.guisebastiao.authentication.service;

import com.guisebastiao.authentication.dto.MailDTO;

public interface MailService {
    void sendMail(MailDTO mailDTO);
}
