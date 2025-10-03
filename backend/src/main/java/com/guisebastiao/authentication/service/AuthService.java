package com.guisebastiao.authentication.service;

import com.guisebastiao.authentication.dto.DefaultResponse;
import com.guisebastiao.authentication.dto.request.LoginRequest;
import com.guisebastiao.authentication.dto.request.RegisterRequest;
import com.guisebastiao.authentication.dto.response.LoginResponse;
import com.guisebastiao.authentication.dto.response.RegisterResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {
    DefaultResponse<LoginResponse> login(LoginRequest dto, HttpServletResponse res);
    DefaultResponse<RegisterResponse> register(RegisterRequest dto);
    DefaultResponse<Void> refresh(HttpServletRequest req, HttpServletResponse res);
    DefaultResponse<Void> logout(HttpServletResponse res);
}
