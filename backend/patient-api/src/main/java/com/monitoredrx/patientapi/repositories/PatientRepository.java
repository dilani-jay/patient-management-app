package com.monitoredrx.patientapi.repositories;

import com.monitoredrx.patientapi.entities.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient, Long> {
}
