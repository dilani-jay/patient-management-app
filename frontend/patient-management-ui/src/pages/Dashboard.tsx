import React, { useEffect, useState } from "react";
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { PatientI } from "../types/patientT";
import { getPatients } from "../services/patientService";

const Dashboard: React.FC = () => {

    const [patients, setPatients] = useState<PatientI[]>([]);

    useEffect(() => {
        const fetchPatients = async () => {
            const response = await getPatients();
            setPatients(response?.data.elements ?? [])
        };

        fetchPatients();

    }, []);

    return (
        <div>
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-3xl font-semibold text-gray-900">Patient Dashboard</h1>
                    </div>
                </div>
                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="relative min-w-full divide-y divide-gray-300">
                                <thead>
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                            <a href="#" className="group inline-flex">
                                                Name
                                                <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                    <ChevronDownIcon aria-hidden="true" className="size-5" />
                                                </span>
                                            </a>
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            <a href="#" className="group inline-flex">
                                                Title
                                                <span className="ml-2 flex-none rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200">
                                                    <ChevronDownIcon aria-hidden="true" className="size-5" />
                                                </span>
                                            </a>
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            <a href="#" className="group inline-flex">
                                                Email
                                                <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                    <ChevronDownIcon
                                                        aria-hidden="true"
                                                        className="invisible ml-2 size-5 flex-none rounded text-gray-400 group-hover:visible group-focus:visible"
                                                    />
                                                </span>
                                            </a>
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            <a href="#" className="group inline-flex">
                                                Role
                                                <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                                    <ChevronDownIcon
                                                        aria-hidden="true"
                                                        className="invisible ml-2 size-5 flex-none rounded text-gray-400 group-hover:visible group-focus:visible"
                                                    />
                                                </span>
                                            </a>
                                        </th>
                                        <th scope="col" className="py-3.5 pl-3 pr-0">
                                            <span className="sr-only">Edit</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {patients.map((patient) => (
                                        <tr key={patient.email}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                                {patient.firstName}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{patient.lastName}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{patient.email}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{patient.address}</td>
                                            <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm sm:pr-0">
                                                <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                                    Edit<span className="sr-only">, {patient.phoneNumber}</span>
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;