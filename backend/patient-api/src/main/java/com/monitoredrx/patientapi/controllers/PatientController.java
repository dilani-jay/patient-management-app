package com.monitoredrx.patientapi.controllers;

import com.monitoredrx.patientapi.dtos.PaginatedResponse;
import com.monitoredrx.patientapi.dtos.PatientRequestDTO;
import com.monitoredrx.patientapi.dtos.PatientResponseDTO;
import com.monitoredrx.patientapi.services.PatientService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patients")
@AllArgsConstructor
public class PatientController {

    private final PatientService service;

    @PostMapping
    public ResponseEntity<PatientResponseDTO> create(@RequestBody PatientRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.createPatient(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getPatientById(id));
    }

    @GetMapping
    public ResponseEntity<PaginatedResponse<PatientResponseDTO>> getAll(@PageableDefault(size = 50) Pageable pageable) {
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
