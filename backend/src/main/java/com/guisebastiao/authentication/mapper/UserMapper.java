package com.guisebastiao.authentication.mapper;

import com.guisebastiao.authentication.dto.request.RegisterRequest;
import com.guisebastiao.authentication.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toEntity(RegisterRequest dto);
}
