package com.monitoredrx.patientapi.services;

import com.monitoredrx.patientapi.dtos.PatientRequestDTO;
import com.monitoredrx.patientapi.entities.Patient;
import com.monitoredrx.patientapi.exceptions.PatientNotFoundException;
import com.monitoredrx.patientapi.repositories.PatientRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class PatientService {

    private final PatientRepository repository;

    public List<Patient> getAllPatients() {
        return repository.findAll();
    }

    public Patient getPatientById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new PatientNotFoundException(id));
    }

    public Patient createPatient(PatientRequestDTO dto) {
        Patient patient = new Patient();
        mapDtoToEntity(dto, patient);

        return repository.save(patient);
    }

    public Patient updatePatient(Long id, PatientRequestDTO dto) {
        Patient existing = repository.findById(id)
                .orElseThrow(() -> new PatientNotFoundException(id));

        mapDtoToEntity(dto, existing);

        return repository.save(existing);
    }

    public void deletePatient(Long id) {
        Patient existing = repository.findById(id)
                .orElseThrow(() -> new PatientNotFoundException(id));

        repository.delete(existing);
    }

    private void mapDtoToEntity(PatientRequestDTO dto, Patient patient) {
        patient.setFirstName(dto.getFirstName());
        patient.setLastName(dto.getLastName());
        patient.setAddress(dto.getAddress());
        patient.setCity(dto.getCity());
        patient.setState(dto.getState());
        patient.setZipCode(dto.getZipCode());
        patient.setPhoneNumber(dto.getPhoneNumber());
        patient.setEmail(dto.getEmail());
    }
}
