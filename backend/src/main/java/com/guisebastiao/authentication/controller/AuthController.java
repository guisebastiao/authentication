package com.guisebastiao.authentication.controller;

import com.guisebastiao.authentication.dto.DefaultResponse;
import com.guisebastiao.authentication.dto.request.LoginRequest;
import com.guisebastiao.authentication.dto.request.RegisterRequest;
import com.guisebastiao.authentication.dto.response.LoginResponse;
import com.guisebastiao.authentication.dto.response.RegisterResponse;
import com.guisebastiao.authentication.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<DefaultResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest dto, HttpServletResponse httpResponse) {
        DefaultResponse<LoginResponse> response = authService.login(dto, httpResponse);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/register")
    public ResponseEntity<DefaultResponse<RegisterResponse>> register(@Valid @RequestBody RegisterRequest dto) {
        DefaultResponse<RegisterResponse> response = authService.register(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<DefaultResponse<Void>> refresh(HttpServletRequest req, HttpServletResponse res) {
        DefaultResponse<Void> response = authService.refresh(req, res);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<DefaultResponse<Void>> logout(HttpServletResponse res) {
        DefaultResponse<Void> response = authService.logout(res);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
