import axios from "axios";
import { PatientRequestBodyType } from "../types/patient";

const API_URL = "/api/patients";

export const getPatients = async () => {
    try {
        const response = await axios.get(API_URL);
        return response;
    } catch (error) {
        console.error('Error fetching patients: ', error);
    }
}

export const updatePatient = async (patientId: number, requestBody: PatientRequestBodyType) => {
    try {
        const response = await axios.put(`${API_URL}/${patientId}`, requestBody);
        return response;
    } catch (error) {
        console.error('Error updating patient: ', error);
    }
}