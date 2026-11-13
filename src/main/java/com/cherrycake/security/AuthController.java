package com.cherrycake.security;

import com.cherrycake.common.exception.ResourceNotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "User registration, authentication and JWT management")
public class AuthController
{
    private final AuthService authService;

    @PostMapping({"/api/auth/register", "/api/v1/auth/register"})
    @Operation(summary = "Register a new user account")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request)
    {
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping({"/api/auth/login", "/api/v1/auth/login"})
    @Operation(summary = "Authenticate user and receive a JWT Bearer token")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request)
    {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping({"/api/auth/me", "/api/v1/auth/me"})
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get profile information of current authenticated user")
    public ResponseEntity<AuthResponse> getCurrentUser()
    {
        User user = authService.getCurrentAuthenticatedUser();

        if (user == null)
            throw new ResourceNotFoundException("User session expired or invalid");

        AuthResponse profile = AuthResponse.builder()
            .userId(user.getId())
            .email(user.getEmail())
            .fullName(user.getFullName())
            .role(user.getRole())
            .user
            (AuthResponse.UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .fullName(user.getFullName())
                .build()
            )
            .build();

        return ResponseEntity.ok(profile);
    }
}