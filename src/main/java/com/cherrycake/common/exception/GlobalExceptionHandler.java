package com.cherrycake.common.exception;

import com.cherrycake.common.response.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler
{
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex, HttpServletRequest request)
    {
        ErrorResponse error = ErrorResponse.builder()
        .status(HttpStatus.NOT_FOUND.value())
        .error(HttpStatus.NOT_FOUND.getReasonPhrase())
        .message(ex.getMessage())
        .timestamp(Instant.now().toString())
        .path(request.getRequestURI())
        .build();
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResponse> handleBadRequest(BadRequestException ex, HttpServletRequest request)
    {
        ErrorResponse error = ErrorResponse.builder()
        .status(HttpStatus.BAD_REQUEST.value())
        .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
        .message(ex.getMessage())
        .timestamp(Instant.now().toString())
        .path(request.getRequestURI())
        .build();
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ErrorResponse> handleMissingParam(MissingServletRequestParameterException ex, HttpServletRequest request)
    {
        Map<String, String> errors = Collections.singletonMap(ex.getParameterName(), "Parameter is required");
        ErrorResponse error = ErrorResponse.builder()
        .status(HttpStatus.BAD_REQUEST.value())
        .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
        .message("Required request parameter is missing: " + ex.getParameterName())
        .errors(errors)
        .timestamp(Instant.now().toString())
        .path(request.getRequestURI())
        .build();
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ProductUnavailableException.class)
    public ResponseEntity<ErrorResponse> handleProductUnavailable(ProductUnavailableException ex, HttpServletRequest request)
    {
        ErrorResponse error = ErrorResponse.builder()
        .status(HttpStatus.BAD_REQUEST.value())
        .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
        .message(ex.getMessage() != null ? ex.getMessage() : "Товар недоступен в выбранном регионе")
        .errors(ex.getErrors())
        .timestamp(Instant.now().toString())
        .path(request.getRequestURI())
        .build();
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(PromoCodeInvalidException.class)
    public ResponseEntity<ErrorResponse> handlePromoCodeInvalid(PromoCodeInvalidException ex, HttpServletRequest request)
    {
        ErrorResponse error = ErrorResponse.builder()
        .status(HttpStatus.BAD_REQUEST.value())
        .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
        .message(ex.getMessage() != null ? ex.getMessage() : "Промокод недействителен")
        .timestamp(Instant.now().toString())
        .path(request.getRequestURI())
        .build();
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ErrorResponse> handleConflict(ConflictException ex, HttpServletRequest request)
    {
        ErrorResponse error = ErrorResponse.builder()
        .status(HttpStatus.CONFLICT.value())
        .error(HttpStatus.CONFLICT.getReasonPhrase())
        .message(ex.getMessage())
        .timestamp(Instant.now().toString())
        .path(request.getRequestURI())
        .build();
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(SlotUnavailableException.class)
    public ResponseEntity<ErrorResponse> handleSlotUnavailable(SlotUnavailableException ex, HttpServletRequest request)
    {
        ErrorResponse error = ErrorResponse.builder()
        .status(HttpStatus.CONFLICT.value())
        .error(HttpStatus.CONFLICT.getReasonPhrase())
        .message(ex.getMessage() != null ? ex.getMessage() : "Выбранный слот уже заполнен, выберите другое время")
        .timestamp(Instant.now().toString())
        .path(request.getRequestURI())
        .build();
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(BookingConflictException.class)
    public ResponseEntity<ErrorResponse> handleBookingConflict(BookingConflictException ex, HttpServletRequest request)
    {
        ErrorResponse error = ErrorResponse.builder()
        .status(HttpStatus.CONFLICT.value())
        .error(HttpStatus.CONFLICT.getReasonPhrase())
        .message(ex.getMessage() != null ? ex.getMessage() : "Нет свободного столика на это время, попробуйте другое")
        .timestamp(Instant.now().toString())
        .path(request.getRequestURI())
        .build();
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request)
    {
        Map<String, String> errors = new LinkedHashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors())
        { errors.put(fieldError.getField(), fieldError.getDefaultMessage()); }

        ErrorResponse error = ErrorResponse.builder()
        .status(HttpStatus.BAD_REQUEST.value())
        .error("Validation Error")
        .message("Validation failed")
        .errors(errors)
        .timestamp(Instant.now().toString())
        .path(request.getRequestURI())
        .build();
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthException(AuthenticationException ex, HttpServletRequest request)
    {
        ErrorResponse error = ErrorResponse.builder()
        .status(HttpStatus.UNAUTHORIZED.value())
        .error(HttpStatus.UNAUTHORIZED.getReasonPhrase())
        .message("Требуется вход")
        .timestamp(Instant.now().toString())
        .path(request.getRequestURI())
        .build();
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex, HttpServletRequest request)
    {
        ErrorResponse error = ErrorResponse.builder()
        .status(HttpStatus.FORBIDDEN.value())
        .error(HttpStatus.FORBIDDEN.getReasonPhrase())
        .message("Недостаточно прав")
        .timestamp(Instant.now().toString())
        .path(request.getRequestURI())
        .build();
        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex, HttpServletRequest request)
    {
        org.slf4j.LoggerFactory.getLogger(GlobalExceptionHandler.class).error("Unhandled exception at " + request.getRequestURI(), ex);
        ErrorResponse error = ErrorResponse.builder()
        .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
        .error(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase())
        .message("Внутренняя ошибка: " + ex.getMessage())
        .timestamp(Instant.now().toString())
        .path(request.getRequestURI())
        .build();
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}