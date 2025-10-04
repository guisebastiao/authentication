package com.guisebastiao.authentication.controller;

import com.guisebastiao.authentication.dto.DefaultResponse;
import com.guisebastiao.authentication.dto.request.CreateRecoverPasswordRequest;
import com.guisebastiao.authentication.dto.request.RecoverPasswordRequest;
import com.guisebastiao.authentication.service.RecoverPasswordService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/recover-password")
public class RecoverPasswordController {

    @Autowired
    private RecoverPasswordService recoverPasswordService;

    @PostMapping
    public ResponseEntity<DefaultResponse<Void>> createRecoverPassword(@RequestBody @Valid CreateRecoverPasswordRequest dto) {
        DefaultResponse<Void> response = this.recoverPasswordService.createRecoverPassword(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{recoverToken}")
    public ResponseEntity<DefaultResponse<Void>> resetPassword(@PathVariable String recoverToken, @RequestBody @Valid RecoverPasswordRequest dto) {
        DefaultResponse<Void> response = this.recoverPasswordService.resetPassword(recoverToken, dto);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
