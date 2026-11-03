package com.cherrycake.dto.response;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDto
{
    private Long id;
    private String code;
    private String name;
    private String description;

    @JsonProperty("sortOrder")
    @JsonAlias({"displayOrder", "sortOrder"})
    private Integer sortOrder;

    private Integer displayOrder;

    public Integer getSortOrder()
    {
        return sortOrder != null ? sortOrder : displayOrder;
    }

    public Integer getDisplayOrder()
    {
        return displayOrder != null ? displayOrder : sortOrder;
    }
}
