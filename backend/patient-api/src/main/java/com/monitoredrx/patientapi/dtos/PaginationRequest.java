package com.monitoredrx.patientapi.dtos;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaginationRequest {
    @Min(0)
    private int page = 0;

    @Min(1)
    @Max(100)
    private int size = 50;

    private String sortBy = "id";

    private String direction = "asc";
}
