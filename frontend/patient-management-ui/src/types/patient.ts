export interface PatientI {
    id: number,
    firstName: string,
    lastName: string,
    address?: string,
    city?: string,
    state?: string,
    zipCode?: string,
    phoneNumber: string,
    email?: string,
}

export type PatientRequestBodyType = Omit<PatientI, "id">;