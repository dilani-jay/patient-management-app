import React, { useEffect, useState } from "react";
import { CheckIcon, XMarkIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import { PatientI, PatientRequestBodyType } from "../types/patient";
import { createPatient, deletePatient, getPatients, updatePatient } from "../services/patientService";
import Input from "../components/Input";
import DeleteConfirmationDialog from "../components/DeleteConfirmationDialog";
import toast from "react-hot-toast";
import SortIcon from "../components/SortIcon";
import { isValidEmail, isValidPhoneNumber, isValidZipCode } from "../utils/validationHelpers";
import { INVALID_EMAIL, INVALID_PHONE_NUMBER, INVALID_ZIP_CODE, PATIENT_CREATE_ERROR, PATIENT_DELETE_ERROR, PATIENT_UPDATE_ERROR, REQUIRED_FIELDS_EMPTY } from "../constants/toastMsgs/errorMsgs";
import { PATIENT_CREATE_SUCCESS, PATIENT_DELETE_SUCCESS, PATIENT_UPDATE_SUCCESS } from "../constants/toastMsgs/successMsgs";

const Dashboard: React.FC = () => {

    const [patients, setPatients] = useState<PatientI[]>([]);
    const [editingPatient, setEditingPatient] = useState<PatientI | null>(null);
    const [creatingPatient, setCreatingPatient] = useState<Partial<PatientI> | null>(null);
    const [deletingPatientId, setDeletingPatientId] = useState<number | null>(null);
    const [sortField, setSortField] = useState<keyof PatientI>('id');
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const headerCellClassName = 'py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6';
    const dataCellClassName = `${headerCellClassName} whitespace-nowrap !font-normal`;
    const iconButtonClassName = 'p-1 rounded-md hover:bg-gray-100 disabled:text-gray-200 disabled:cursor-not-allowed'

    const visiblePatientFields: (keyof PatientI)[] = ["firstName", "lastName", "address", "city", "state", "zipCode", "phoneNumber", "email"];
    const requiredPatientFields: (keyof PatientI)[] = ["firstName", "lastName", "phoneNumber"];

    useEffect(() => {
        const fetchPatients = async () => {
            const response = await getPatients(sortField, sortDirection, currentPage);
            setPatients(response?.data.elements ?? [])
            setTotalPages(response?.data.totalPages ?? 0);
        };

        fetchPatients();

    }, [sortField, sortDirection, currentPage, totalPages]);

    const hasRequiredFieldValues = (patient: PatientI | Partial<PatientI>) => {
        for (const key of requiredPatientFields) {
            const value = patient[key];

            if (!value || value.toString().trim() === "") {
                return false;
            }
        }
        return true;
    }

    const getSaveErrorMsg = (patient: PatientI | Partial<PatientI>) => {
        if (patient.zipCode && !isValidZipCode(patient.zipCode)) {
            return INVALID_ZIP_CODE;
        } else if (patient.email && !isValidEmail(patient.email)) {
            return INVALID_EMAIL;
        } else if (!hasRequiredFieldValues(patient)) {
            return REQUIRED_FIELDS_EMPTY;
        } else if (patient.phoneNumber && !isValidPhoneNumber(patient.phoneNumber)) {
            return INVALID_PHONE_NUMBER;
        }
        return null;
    }

    const toggleEditMode = (patient?: PatientI) => {
        setEditingPatient(patient ?? null)
    }

    const updateEditingPatientField = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: keyof PatientI
    ) => {
        if (!editingPatient) return;
        setEditingPatient({ ...editingPatient, [field]: e.target.value });
    };

    const saveEditedPatient = async () => {

        if (!editingPatient) return;

        const errorMsg = getSaveErrorMsg(editingPatient);

        if (errorMsg) {
            toast.error(errorMsg);
            return;
        }

        const response = await updatePatient(editingPatient.id, editingPatient);
        if (response) {
            setPatients(prev =>
                prev.map(p =>
                    p.id === response.data.id ? response.data : p
                )
            );
            setEditingPatient(null);
            toast.success(PATIENT_UPDATE_SUCCESS);
        } else {
            toast.error(PATIENT_UPDATE_ERROR);
        }

    };

    const deleteSelectedPatient = async () => {
        if (!deletingPatientId) return

        const response = await deletePatient(deletingPatientId);
        if (response) {
            setDeletingPatientId(null);
            toast.success(PATIENT_DELETE_SUCCESS);
            setTotalPages(prev => prev - 1);
        } else {
            toast.error(PATIENT_DELETE_ERROR);
        }
    }

    const updateCreatingPatientField = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: keyof PatientI
    ) => {
        if (creatingPatient) {
            setCreatingPatient({ ...creatingPatient, [field]: e.target.value });
        } else {
            setCreatingPatient({ [field]: e.target.value });
        }
    };

    const saveCreatingPatient = async () => {

        if (!creatingPatient) return;

        const errorMsg = getSaveErrorMsg(creatingPatient);

        if (errorMsg) {
            toast.error(errorMsg);
            return;
        }

        const response = await createPatient(creatingPatient as PatientRequestBodyType);
        if (response) {
            setCreatingPatient(null);
            toast.success(PATIENT_CREATE_SUCCESS);
            setTotalPages(prev => prev + 1);
        } else {
            toast.error(PATIENT_CREATE_ERROR);
        }

    };

    const handleSort = (field: keyof PatientI) => {
        if (sortField === field) {
            setSortDirection(prev => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
        setCurrentPage(0);
    };

    return (
        <div className="flex bg-gradient-to-r from-cyan-50 to-blue-400 min-h-svh w-full">
            <div className="p-4 sm:p-6 lg:p-8 h-full w-full">
                <div className="sm:flex sm:justify-between">
                    <h1 className="text-4xl font-semibold text-blue-950">Patient Dashboard</h1>
                </div>
                <div className="-mx-4 mt-10 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg pb-4 bg-white">
                    <table className="relative min-w-full divide-y divide-gray-300">
                        <thead>
                            <tr>
                                <th scope="col" className={headerCellClassName}>
                                    <span className="group inline-flex cursor-pointer" onClick={() => handleSort('firstName')}>
                                        First Name
                                        <span className="ml-2 flex-none rounded text-gray-400">
                                            {sortField === 'firstName' && <SortIcon direction={sortDirection} />}
                                        </span>
                                    </span>
                                </th>
                                <th scope="col" className={headerCellClassName}>
                                    <span className="group inline-flex cursor-pointer" onClick={() => handleSort('lastName')}>
                                        Last Name
                                        <span className="ml-2 flex-none rounded text-gray-400">
                                            {sortField === 'lastName' && <SortIcon direction={sortDirection} />}
                                        </span>
                                    </span>
                                </th>
                                <th scope="col" className={headerCellClassName}>
                                    Address
                                </th>
                                <th scope="col" className={headerCellClassName}>
                                    <span className="group inline-flex cursor-pointer" onClick={() => handleSort('city')}>
                                        City
                                        <span className="ml-2 flex-none rounded text-gray-400">
                                            {sortField === 'city' && <SortIcon direction={sortDirection} />}
                                        </span>
                                    </span>
                                </th>
                                <th scope="col" className={headerCellClassName}>
                                    State
                                </th>
                                <th scope="col" className={headerCellClassName}>
                                    Zip Code
                                </th>
                                <th scope="col" className={headerCellClassName}>
                                    Phone Number
                                </th>
                                <th scope="col" className={headerCellClassName}>
                                    Email
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            <tr>
                                {visiblePatientFields.map(
                                    (field) => (
                                        <td key={field} className={dataCellClassName}>
                                            <Input className="border rounded px-2 py-1 w-full"
                                                required={requiredPatientFields.includes(field)}
                                                requiredIndicator={!!creatingPatient && requiredPatientFields.includes(field)}
                                                value={creatingPatient?.[field] ?? ''}
                                                onChange={(e) =>
                                                    updateCreatingPatientField(e, field)
                                                } />
                                        </td>
                                    )
                                )}
                                <td className={dataCellClassName}>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={saveCreatingPatient}
                                            className={`text-green-600 ${iconButtonClassName}`}
                                            disabled={!creatingPatient || !hasRequiredFieldValues(creatingPatient)}
                                        >
                                            <CheckIcon className="size-5" />
                                        </button>
                                        <button
                                            onClick={() => setCreatingPatient(null)}
                                            className={`text-gray-500 ${iconButtonClassName}`}
                                            disabled={!creatingPatient}
                                        >
                                            <XMarkIcon className="size-5" />
                                        </button>
                                    </div>

                                </td>
                            </tr>
                            {patients.map((patient) => {

                                const isEditing = editingPatient?.id === patient.id;

                                return (
                                    <tr key={patient.id}>
                                        {visiblePatientFields.map(
                                            (field) => (
                                                <td key={field} className={dataCellClassName}>
                                                    {isEditing ? (
                                                        <Input className="border rounded px-2 py-1 w-full"
                                                            required={requiredPatientFields.includes(field)}
                                                            requiredIndicator={requiredPatientFields.includes(field)}
                                                            value={editingPatient?.[field]}
                                                            onChange={(e) =>
                                                                updateEditingPatientField(e, field)
                                                            } />
                                                    ) : (
                                                        patient[field]
                                                    )}
                                                </td>
                                            )
                                        )}

                                        <td className={dataCellClassName}>
                                            {isEditing ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={saveEditedPatient}
                                                        className={`text-green-600 ${iconButtonClassName}`}
                                                        disabled={!editingPatient || !hasRequiredFieldValues(editingPatient)}
                                                    >
                                                        <CheckIcon className="size-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => toggleEditMode()}
                                                        className={`text-gray-500 ${iconButtonClassName}`}
                                                    >
                                                        <XMarkIcon className="size-5" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => toggleEditMode(patient)}
                                                        className={`text-blue-600 ${iconButtonClassName}`}
                                                    >
                                                        <PencilSquareIcon className="size-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeletingPatientId(patient.id)}
                                                        className={`text-red-600 ${iconButtonClassName}`}
                                                    >
                                                        <TrashIcon className="size-5" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div className="flex items-center justify-between px-4 py-3 border-t">

                        <div className="text-sm text-gray-600">
                            Page {currentPage + 1} of {totalPages}
                        </div>

                        <div className="flex gap-2">
                            <button
                                className="px-3 py-1 border rounded disabled:opacity-50"
                                disabled={currentPage === 0}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                            >
                                Previous
                            </button>

                            <button
                                className="px-3 py-1 border rounded disabled:opacity-50"
                                disabled={currentPage + 1 >= totalPages}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                            >
                                Next
                            </button>
                        </div>

                    </div>
                </div>
            </div>
            <DeleteConfirmationDialog isOpen={!!deletingPatientId} onClose={() => setDeletingPatientId(null)} onConfirm={() => deleteSelectedPatient()} />
        </div>
    );
};

export default Dashboard;