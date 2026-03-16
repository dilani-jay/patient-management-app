package com.monitoredrx.patientapi.controllers;

import com.monitoredrx.patientapi.dtos.PaginationRequest;
import com.monitoredrx.patientapi.dtos.PaginatedResponse;
import com.monitoredrx.patientapi.dtos.PatientRequestDTO;
import com.monitoredrx.patientapi.dtos.PatientResponseDTO;
import com.monitoredrx.patientapi.services.PatientService;
import com.monitoredrx.patientapi.exceptions.BadRequestException;
import com.monitoredrx.patientapi.constants.SortFields;

import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.mockito.Mockito.*;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.util.List;

@ExtendWith(MockitoExtension.class)
public class PatientControllerTest {
    @Mock
    private PatientService service;

    @InjectMocks
    private PatientController controller;

    private PatientRequestDTO requestDTO;
    private PatientResponseDTO responseDTO;

    @BeforeEach
    void setUp() {
        requestDTO = new PatientRequestDTO();
        responseDTO = new PatientResponseDTO(
                1L,
                "John",
                "Doe",
                "31A, Park street",
                "Dallas",
                "Texas",
                "75052",
                "282342899",
                "john.doe@gmail.com"
        );
    }

    @Test
    void create_shouldReturnCreatedPatient() {
        when(service.createPatient(requestDTO)).thenReturn(responseDTO);

        ResponseEntity<PatientResponseDTO> response = controller.create(requestDTO);

        assertEquals(201, response.getStatusCode().value());
        assertEquals(responseDTO, response.getBody());
        verify(service, times(1)).createPatient(requestDTO);
    }

    @Test
    void getById_shouldReturnPatient() {
        when(service.getPatientById(1L)).thenReturn(responseDTO);

        ResponseEntity<PatientResponseDTO> response = controller.getById(1L);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(responseDTO, response.getBody());
        verify(service).getPatientById(1L);
    }

    @Test
    void getAll_shouldReturnPaginatedPatients() {
        PaginationRequest request = new PaginationRequest();
        request.setPage(0);
        request.setSize(10);
        request.setSortBy(SortFields.PATIENT.getFirst());
        request.setDirection("asc");

        PaginatedResponse<PatientResponseDTO> paginatedResponse =
                new PaginatedResponse<>(List.of(responseDTO), 0, 10, 1, 1);

        when(service.getAllPatients(any(Pageable.class)))
                .thenReturn(paginatedResponse);

        ResponseEntity<PaginatedResponse<PatientResponseDTO>> response =
                controller.getAll(request);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(paginatedResponse, response.getBody());
        verify(service).getAllPatients(any(Pageable.class));
    }

    @Test
    void getAll_shouldThrowException_forInvalidSortField() {
        PaginationRequest request = new PaginationRequest();
        request.setSortBy("invalidField");
        request.setDirection("asc");

        assertThrows(BadRequestException.class,
                () -> controller.getAll(request));
    }

    @Test
    void getAll_shouldThrowException_forInvalidDirection() {
        PaginationRequest request = new PaginationRequest();
        request.setSortBy(SortFields.PATIENT.getFirst());
        request.setDirection("invalid");

        assertThrows(BadRequestException.class,
                () -> controller.getAll(request));
    }

    @Test
    void update_shouldReturnUpdatedPatient() {
        when(service.updatePatient(eq(1L), any()))
                .thenReturn(responseDTO);

        ResponseEntity<PatientResponseDTO> response =
                controller.update(1L, requestDTO);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(responseDTO, response.getBody());
        verify(service).updatePatient(1L, requestDTO);
    }

    @Test
    void delete_shouldReturnNoContent() {
        doNothing().when(service).deletePatient(1L);

        ResponseEntity<Void> response = controller.delete(1L);

        assertEquals(204, response.getStatusCode().value());
        verify(service).deletePatient(1L);
    }
}
