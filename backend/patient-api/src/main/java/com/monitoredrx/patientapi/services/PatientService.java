package com.monitoredrx.patientapi.services;

import com.monitoredrx.patientapi.dtos.PatientRequestDTO;
import com.monitoredrx.patientapi.dtos.PatientResponseDTO;
import com.monitoredrx.patientapi.entities.Patient;
import com.monitoredrx.patientapi.exceptions.PatientNotFoundException;
import com.monitoredrx.patientapi.mappers.PatientMapper;
import com.monitoredrx.patientapi.repositories.PatientRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class PatientService {

    private final PatientRepository repository;
    private final PatientMapper mapper;

    public List<PatientResponseDTO> getAllPatients() {
        return repository.findAll().stream()
                .map(mapper::toDTO)
                .toList();
    }

    public PatientResponseDTO getPatientById(Long id) {
        Patient patient = repository.findById(id)
                .orElseThrow(() -> new PatientNotFoundException(id));
        return mapper.toDTO(patient);
    }

    public PatientResponseDTO createPatient(PatientRequestDTO dto) {
        Patient patient = mapper.toEntity(dto);
        Patient saved = repository.save(patient);

        return mapper.toDTO(saved);
    }

    public PatientResponseDTO updatePatient(Long id, PatientRequestDTO dto) {
        Patient existing = repository.findById(id)
                .orElseThrow(() -> new PatientNotFoundException(id));

        Patient updatedData = mapper.toEntity(dto);

        existing.setFirstName(updatedData.getFirstName());
        existing.setLastName(updatedData.getLastName());
        existing.setAddress(updatedData.getAddress());
        existing.setCity(updatedData.getCity());
        existing.setState(updatedData.getState());
        existing.setZipCode(updatedData.getZipCode());
        existing.setPhoneNumber(updatedData.getPhoneNumber());
        existing.setEmail(updatedData.getEmail());

        Patient saved = repository.save(existing);

        return mapper.toDTO(saved);
    }

    public void deletePatient(Long id) {
        Patient existing = repository.findById(id)
                .orElseThrow(() -> new PatientNotFoundException(id));

        repository.delete(existing);
    }
}
