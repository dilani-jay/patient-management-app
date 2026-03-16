import React, { useEffect, useMemo, useState } from "react";
import { ChevronDownIcon, CheckIcon, XMarkIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import { PatientI, PatientRequestBodyType } from "../types/patient";
import { createPatient, deletePatient, getPatients, updatePatient } from "../services/patientService";
import Input from "../components/Input";
import DeleteConfirmationDialog from "../components/DeleteConfirmationDialog";
import toast from "react-hot-toast";

const Dashboard: React.FC = () => {

    const [patients, setPatients] = useState<PatientI[]>([]);
    const [editingPatient, setEditingPatient] = useState<PatientI | null>(null);
    const [creatingPatient, setCreatingPatient] = useState<Partial<PatientI> | null>(null);
    const [deletingPatientId, setDeletingPatientId] = useState<number | null>(null);

    const headerCellClassName = 'py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6';
    const dataCellClassName = `${headerCellClassName} whitespace-nowrap !font-normal`;
    const iconButtonClassName = 'p-1 rounded-md hover:bg-gray-100 disabled:text-gray-200 disabled:cursor-not-allowed'

    const visiblePatientFields: (keyof PatientI)[] = ["firstName", "lastName", "address", "city", "state", "zipCode", "phoneNumber", "email"];
    const requiredPatientFields: (keyof PatientI)[] = ["firstName", "lastName", "phoneNumber"];

    useEffect(() => {
        const fetchPatients = async () => {
            const response = await getPatients();
            setPatients(response?.data.elements ?? [])
        };

        fetchPatients();

    }, []);

    const disableCreateSaveButton = useMemo(() => {
        return !creatingPatient || !creatingPatient.firstName || !creatingPatient.lastName || !creatingPatient.phoneNumber
    }, [creatingPatient]);

    const disableEditSaveButton = useMemo(() => {
        return !editingPatient || !editingPatient.firstName || !editingPatient.lastName || !editingPatient.phoneNumber
    }, [editingPatient]);

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

        const response = await updatePatient(editingPatient.id, editingPatient);
        if (response) {
            setPatients(prev =>
                prev.map(p =>
                    p.id === response.data.id ? response.data : p
                )
            );
            setEditingPatient(null);
            toast.success("Patient updated successfully");
        } else {
            toast.error("Failed to update patient");
        }

    };

    const deleteSelectedPatient = async () => {
        if (!deletingPatientId) return

        const response = await deletePatient(deletingPatientId);

        if (response) {
            setPatients(prev =>
                prev.filter(p =>
                    p.id !== deletingPatientId
                )
            );
            setDeletingPatientId(null);
            toast.success("Patient deleted successfully");
        } else {
            toast.error("Failed to delete patient");
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

        const response = await createPatient(creatingPatient as PatientRequestBodyType);
        if (response) {
            setPatients(prev =>
                [response.data, ...prev]
            );
            setCreatingPatient(null);
            toast.success("Patient created successfully");
        } else {
            toast.error("Failed to create patient");
        }

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
                                    <a href="#" className="group inline-flex">
                                        First Name
                                        <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                            <ChevronDownIcon aria-hidden="true" className="size-5" />
                                        </span>
                                    </a>
                                </th>
                                <th scope="col" className={headerCellClassName}>
                                    <a href="#" className="group inline-flex">
                                        Last Name
                                        <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                            <ChevronDownIcon aria-hidden="true" className="size-5" />
                                        </span>
                                    </a>
                                </th>
                                <th scope="col" className={headerCellClassName}>
                                    Address
                                </th>
                                <th scope="col" className={headerCellClassName}>
                                    <a href="#" className="group inline-flex">
                                        City
                                        <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                            <ChevronDownIcon
                                                aria-hidden="true"
                                                className="invisible ml-2 size-5 flex-none rounded text-gray-400 group-hover:visible group-focus:visible"
                                            />
                                        </span>
                                    </a>
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
                                            disabled={disableCreateSaveButton}
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
                                                        disabled={disableEditSaveButton}
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
                </div>
            </div>
            <DeleteConfirmationDialog isOpen={!!deletingPatientId} onClose={() => setDeletingPatientId(null)} onConfirm={() => deleteSelectedPatient()} />
        </div>
    );
};

export default Dashboard;