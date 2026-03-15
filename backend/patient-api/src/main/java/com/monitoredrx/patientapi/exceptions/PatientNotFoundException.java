package com.monitoredrx.patientapi.exceptions;

public class PatientNotFoundException extends RuntimeException{
    public PatientNotFoundException(Long id) {
        super("Patient not found with id: " + id);
    }
}
