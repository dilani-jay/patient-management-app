package com.monitoredrx.patientapi.controllers;

import com.monitoredrx.patientapi.dtos.PatientRequestDTO;
import com.monitoredrx.patientapi.entities.Patient;
import com.monitoredrx.patientapi.services.PatientService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patient")
@AllArgsConstructor
public class PatientController {

    private final PatientService service;

    @PostMapping
    public ResponseEntity<Patient> create(@RequestBody PatientRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.createPatient(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getPatientById(id));
    }

    @GetMapping
    public ResponseEntity<List<Patient>> getAll() {
        return ResponseEntity.ok(service.getAllPatients());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Patient> update(@PathVariable Long id,
                                          @RequestBody PatientRequestDTO dto) {
        return ResponseEntity.ok(service.updatePatient(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deletePatient(id);
        return ResponseEntity.noContent().build();
    }
}
