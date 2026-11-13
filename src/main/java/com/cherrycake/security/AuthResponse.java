package com.cherrycake.security;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse
{
    private String token;
    private String type;
    private Long userId;
    private String email;
    private String fullName;
    private String role;
    private UserDto user;

    public UserDto getUser()
    {
        if (user != null) return user;
        return UserDto.builder()
        .id(userId)
        .email(email)
        .role(role)
        .fullName(fullName)
        .build();
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserDto
    {
        private Long id;
        private String email;
        private String role;
        private String fullName;
    }
}