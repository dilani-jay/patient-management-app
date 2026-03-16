import axios from "axios";

const API_URL = "/api/patients";

export const getPatients = async () => {
    try {
        const response = await axios.get(API_URL);
        return response;
    } catch (error) {
        console.error('Error fetching patients:', error);
    }
}