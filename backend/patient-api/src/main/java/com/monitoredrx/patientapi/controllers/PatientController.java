package com.monitoredrx.patientapi.controllers;

import com.monitoredrx.patientapi.constants.SortFields;
import com.monitoredrx.patientapi.dtos.PaginatedResponse;
import com.monitoredrx.patientapi.dtos.PaginationRequest;
import com.monitoredrx.patientapi.dtos.PatientRequestDTO;
import com.monitoredrx.patientapi.dtos.PatientResponseDTO;
import com.monitoredrx.patientapi.exceptions.BadRequestException;
import com.monitoredrx.patientapi.services.PatientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patients")
@AllArgsConstructor
@Tag(name = "Patients", description = "Patient management APIs")
public class PatientController {

    private final PatientService service;

    @Operation(summary = "Create a new patient")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Patient created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request")
    })
    @PostMapping
    public ResponseEntity<PatientResponseDTO> create(@Valid @RequestBody PatientRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.createPatient(dto));
    }

    @Operation(summary = "Get patient by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Patient found"),
            @ApiResponse(responseCode = "404", description = "Patient not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<PatientResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getPatientById(id));
    }

    @Operation(summary = "Get all patients with pagination")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Patients retrieved"),
            @ApiResponse(responseCode = "400", description = "Invalid pagination or sorting parameters")
    })
    @Validated
    @GetMapping
    public ResponseEntity<PaginatedResponse<PatientResponseDTO>> getAll(@ModelAttribute @Valid PaginationRequest request) {
        if (!SortFields.PATIENT.contains(request.getSortBy())) {
            throw new BadRequestException("Invalid sortBy value: '" +  request.getSortBy() +
                    "'. Allowed values are: " + String.join(", ", SortFields.PATIENT));
        }

        Sort.Direction direction;

        try {
            direction = Sort.Direction.fromString(request.getDirection());
        } catch (Exception e) {
            throw new BadRequestException("Invalid direction value. Use 'asc' or 'desc'");
        }

        Pageable pageable = PageRequest.of(
                request.getPage(),
                request.getSize(),
                Sort.by(direction, request.getSortBy())
        );

        return ResponseEntity.ok(service.getAllPatients(pageable));
    }

    @Operation(summary = "Update patient details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Patient updated"),
            @ApiResponse(responseCode = "404", description = "Patient not found")
    })
    @PutMapping("/{id}")
    public ResponseEntity<PatientResponseDTO> update(@PathVariable Long id,
                                                     @Valid @RequestBody PatientRequestDTO dto) {
        return ResponseEntity.ok(service.updatePatient(id, dto));
    }

    @Operation(summary = "Delete patient")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Patient deleted"),
            @ApiResponse(responseCode = "404", description = "Patient not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deletePatient(id);
        return ResponseEntity.noContent().build();
    }
}
