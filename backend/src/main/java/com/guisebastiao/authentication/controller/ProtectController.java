package com.guisebastiao.authentication.controller;

import com.guisebastiao.authentication.dto.DefaultResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/protect")
public class ProtectController {

    @GetMapping
    public ResponseEntity<DefaultResponse<String>> protect() {
        DefaultResponse<String> response = new DefaultResponse<String>(true, "Acesso autorizado", "Rota protegida acessada com sucesso!");
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
