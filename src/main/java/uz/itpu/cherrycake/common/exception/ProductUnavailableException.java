package uz.itpu.cherrycake.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.Map;

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
