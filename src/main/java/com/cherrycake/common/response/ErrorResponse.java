package com.cherrycake.common.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse
{
    private int status;
    private String message;
    private Map<String, String> errors;
    
    @Builder.Default
    private String timestamp = Instant.now().toString();
    
    private String path;

    // Backward compatibility fields
    private String error;
    private List<String> details;
}