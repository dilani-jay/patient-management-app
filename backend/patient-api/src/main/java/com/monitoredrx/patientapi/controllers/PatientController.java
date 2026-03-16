package com.monitoredrx.patientapi.controllers;

import com.monitoredrx.patientapi.constants.SortFields;
import com.monitoredrx.patientapi.dtos.PaginatedResponse;
import com.monitoredrx.patientapi.dtos.PaginationRequest;
import com.monitoredrx.patientapi.dtos.PatientRequestDTO;
import com.monitoredrx.patientapi.dtos.PatientResponseDTO;
import com.monitoredrx.patientapi.exceptions.BadRequestException;
import com.monitoredrx.patientapi.services.PatientService;
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
public class PatientController {

    private final PatientService service;

    @PostMapping
    public ResponseEntity<PatientResponseDTO> create(@Valid @RequestBody PatientRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.createPatient(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getPatientById(id));
    }

    @Validated
    @GetMapping
    public ResponseEntity<PaginatedResponse<PatientResponseDTO>> getAll(@Valid PaginationRequest request) {
        if (!SortFields.PATIENT.contains(request.getSortBy())) {
            throw new BadRequestException("Invalid sort field");
        }

        Sort.Direction direction;

        try {
            direction = Sort.Direction.fromString(request.getDirection());
        } catch (Exception e) {
            throw new BadRequestException("Invalid sort direction. Use 'asc' or 'desc'");
        }

        Pageable pageable = PageRequest.of(
                request.getPage(),
                request.getSize(),
                Sort.by(direction, request.getSortBy())
        );

        return ResponseEntity.ok(service.getAllPatients(pageable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PatientResponseDTO> update(@PathVariable Long id,
                                                     @RequestBody PatientRequestDTO dto) {
        return ResponseEntity.ok(service.updatePatient(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deletePatient(id);
        return ResponseEntity.noContent().build();
    }
}
