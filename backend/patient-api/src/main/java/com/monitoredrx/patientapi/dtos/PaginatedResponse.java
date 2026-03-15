package com.monitoredrx.patientapi.dtos;

import java.util.List;

public record PaginatedResponse<T>(List<T> elements,
                                   int page,
                                   int size,
                                   long totalElements,
                                   int totalPages) {
}
