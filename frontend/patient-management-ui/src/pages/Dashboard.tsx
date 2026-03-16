import React, { useEffect, useState } from "react";
import { ChevronDownIcon, CheckIcon, XMarkIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import { PatientI } from "../types/patient";
import { deletePatient, getPatients, updatePatient } from "../services/patientService";

const Dashboard: React.FC = () => {

    const [patients, setPatients] = useState<PatientI[]>([]);
    const [editingPatient, setEditingPatient] = useState<PatientI | null>(null);

    const headerCellClassName = 'py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6';
    const dataCellClassName = `${headerCellClassName} whitespace-nowrap !font-normal`;

    const patientFields: (keyof PatientI)[] = ["firstName", "lastName", "address", "city", "state", "zipCode", "phoneNumber", "email"];

    useEffect(() => {
        const fetchPatients = async () => {
            const response = await getPatients();
            setPatients(response?.data.elements ?? [])
        };

        fetchPatients();

    }, []);

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
        }

    };

    const deleteSelectedPatient = async (patientId: number) => {
        const response = await deletePatient(patientId);
        
        if(response) {
            setPatients(prev =>
                prev.filter(p =>
                    p.id !== patientId
                )
            );
        }       
    }

    return (
        <div className="flex bg-gradient-to-r from-cyan-50 to-blue-400 h-svh w-full">
            <div className="p-4 sm:p-6 lg:p-8 h-full w-full">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-4xl font-semibold text-gray-900">Patient Dashboard</h1>
                    </div>
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
                            {patients.map((patient) => {

                                const isEditing = editingPatient?.id === patient.id;

                                return (
                                    <tr key={patient.id}>
                                        {patientFields.map(
                                            (field) => (
                                                <td key={field} className={dataCellClassName}>
                                                    {isEditing ? (
                                                        <input
                                                            className="border rounded px-2 py-1 w-full"
                                                            value={editingPatient?.[field]}
                                                            onChange={(e) =>
                                                                updateEditingPatientField(e, field)
                                                            }
                                                        />
                                                    ) : (
                                                        (patient as any)[field]
                                                    )}
                                                </td>
                                            )
                                        )}

                                        <td className={dataCellClassName}>
                                            {isEditing ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={saveEditedPatient}
                                                        className="text-green-600"
                                                    >
                                                        <CheckIcon className="size-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => toggleEditMode()}
                                                        className="text-gray-500"
                                                    >
                                                        <XMarkIcon className="size-5" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => toggleEditMode(patient)}
                                                        className="text-blue-700"
                                                    >
                                                        <PencilSquareIcon className="size-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteSelectedPatient(patient.id)}
                                                        className="text-rose-600"
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
        </div>
    );
};

export default Dashboard;