package com.cherrycake.common.exception;

import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ProductUnavailableException extends RuntimeException
{
    private final Map<String, String> errors;

    public ProductUnavailableException(String message)
    {
        super(message);
        this.errors = null;
    }

    public ProductUnavailableException(String message, Map<String, String> errors)
    {
        super(message);
        this.errors = errors;
    }

    public Map<String, String> getErrors()
    {
        return errors;
    }
}
