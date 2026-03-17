package com.monitoredrx.patientapi.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PatientRequestDTO {
    @NotBlank(message = "First Name is required")
    private String firstName;

    @NotBlank(message = "Last Name is required")
    private String lastName;

    private String address;

    private String city;

    private String state;

    @Pattern(
            regexp = "^[0-9]{5}(?:-[0-9]{4})?$",
            message = "Zip Code must be valid (e.g., 12345 or 12345-6789)"
    )
    private String zipCode;

    @NotBlank(message = "Phone Number is required")
    @Pattern(
            regexp = "^\\+?[0-9]{5,15}$",
            message = "Phone number must contain only digits, optionally start with +, and be 5-15 digits long"
    )
    private String phoneNumber;

    @Email(message = "Email must be valid")
    private String email;
}
