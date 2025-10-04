package com.guisebastiao.authentication.service;

import com.guisebastiao.authentication.dto.DefaultResponse;
import com.guisebastiao.authentication.dto.request.CreateRecoverPasswordRequest;
import com.guisebastiao.authentication.dto.request.RecoverPasswordRequest;

public interface RecoverPasswordService {
    DefaultResponse<Void> createRecoverPassword(CreateRecoverPasswordRequest dto);
    DefaultResponse<Void> resetPassword(String recoverToken, RecoverPasswordRequest dto);
}
