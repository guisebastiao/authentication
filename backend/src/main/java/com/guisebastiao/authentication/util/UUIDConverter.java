package com.guisebastiao.authentication.util;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

public class UUIDConverter {
    public static UUID toUUID(String id) {
        try {
            return UUID.fromString(id);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O id está inválido");
        }
    }
}