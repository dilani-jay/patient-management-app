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

export const deletePatient = async (patientId: number) => {
    try {
        const response = await axios.delete(`${API_URL}/${patientId}`);
        return response;
    } catch (error) {
        console.error('Error deleting patient: ', error);
    }
}

export const createPatient = async (requestBody: PatientRequestBodyType) => {
    try {
        const response = await axios.post(API_URL, requestBody);
        return response;
    } catch (error) {
        console.error('Error creating patient: ', error);
    }
};