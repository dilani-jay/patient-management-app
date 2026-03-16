package com.monitoredrx.patientapi.services;

import com.monitoredrx.patientapi.dtos.PaginatedResponse;
import com.monitoredrx.patientapi.dtos.PatientRequestDTO;
import com.monitoredrx.patientapi.dtos.PatientResponseDTO;
import com.monitoredrx.patientapi.entities.Patient;
import com.monitoredrx.patientapi.exceptions.PatientNotFoundException;
import com.monitoredrx.patientapi.mappers.PatientMapper;
import com.monitoredrx.patientapi.repositories.PatientRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PatientServiceTest {

    @Mock
    private PatientRepository repository;

    @Mock
    private PatientMapper mapper;

    @InjectMocks
    private PatientService service;

    @Test
    void shouldReturnPaginatedPatients() {

        Pageable pageable = PageRequest.of(0, 10);

        Patient patient = new Patient();
        Page<Patient> page =
                new PageImpl<>(List.of(patient), pageable, 1);

        when(repository.findAll(pageable)).thenReturn(page);

        when(mapper.toDTO(any(Patient.class)))
                .thenReturn(mock(PatientResponseDTO.class));

        PaginatedResponse<PatientResponseDTO> result =
                service.getAllPatients(pageable);

        assertEquals(1, result.totalElements());
        assertEquals(1, result.elements().size());

        verify(repository).findAll(pageable);
    }

    @Test
    void shouldReturnPatientById() {

        Long id = 1L;
        Patient patient = new Patient();

        when(repository.findById(id)).thenReturn(Optional.of(patient));
        when(mapper.toDTO(any(Patient.class))).thenReturn(mock(PatientResponseDTO.class));

        PatientResponseDTO result = service.getPatientById(id);

        assertNotNull(result);
        verify(repository).findById(id);
    }

    @Test
    void shouldThrowExceptionWhenPatientNotFound() {

        Long id = 1L;

        when(repository.findById(id)).thenReturn(Optional.empty());

        assertThrows(PatientNotFoundException.class,
                () -> service.getPatientById(id));

        verify(repository).findById(id);
    }

    @Test
    void shouldCreatePatient() {

        PatientRequestDTO dto = new PatientRequestDTO();
        Patient patient = new Patient();
        Patient saved = new Patient();

        when(mapper.toEntity(dto)).thenReturn(patient);
        when(repository.save(patient)).thenReturn(saved);
        when(mapper.toDTO(saved)).thenReturn(mock(PatientResponseDTO.class));

        PatientResponseDTO result = service.createPatient(dto);

        assertNotNull(result);
        verify(repository).save(patient);
    }

    @Test
    void shouldUpdatePatient() {

        Long id = 1L;

        PatientRequestDTO dto = new PatientRequestDTO();
        Patient existing = new Patient();
        Patient updated = new Patient();

        when(repository.findById(id)).thenReturn(Optional.of(existing));
        when(mapper.toEntity(dto)).thenReturn(updated);
        when(repository.save(existing)).thenReturn(existing);
        when(mapper.toDTO(existing)).thenReturn(mock(PatientResponseDTO.class));

        PatientResponseDTO result = service.updatePatient(id, dto);

        assertNotNull(result);
        verify(repository).save(existing);
    }

    @Test
    void shouldThrowExceptionWhenUpdatingNonExistingPatient() {

        Long id = 1L;
        PatientRequestDTO dto = new PatientRequestDTO();

        when(repository.findById(id)).thenReturn(Optional.empty());

        assertThrows(PatientNotFoundException.class,
                () -> service.updatePatient(id, dto));
    }

    @Test
    void shouldDeletePatient() {

        Long id = 1L;
        Patient existing = new Patient();

        when(repository.findById(id)).thenReturn(Optional.of(existing));

        service.deletePatient(id);

        verify(repository).delete(existing);
    }

    @Test
    void shouldThrowExceptionWhenDeletingNonExistingPatient() {

        Long id = 1L;

        when(repository.findById(id)).thenReturn(Optional.empty());

        assertThrows(PatientNotFoundException.class,
                () -> service.deletePatient(id));
    }
}
