package com.monitoredrx.patientapi.dtos;

import lombok.*;

@AllArgsConstructor
@Getter
public class PatientResponseDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String phoneNumber;
    private String email;
}
