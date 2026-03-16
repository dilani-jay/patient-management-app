import React, { useEffect, useState } from "react";
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { PatientI } from "../types/patient";
import { getPatients } from "../services/patientService";

const Dashboard: React.FC = () => {

    const [patients, setPatients] = useState<PatientI[]>([]);

    const headerCellClassName = 'py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6';
    const dataCellClassName = `${headerCellClassName} whitespace-nowrap font-normal`

    useEffect(() => {
        const fetchPatients = async () => {
            const response = await getPatients();
            setPatients(response?.data.elements ?? [])
        };

        fetchPatients();

    }, []);

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
                            {patients.map((patient) => (
                                <tr key={patient.email}>
                                    <td className={dataCellClassName}>
                                        {patient.firstName}
                                    </td>
                                    <td className={dataCellClassName}>
                                        {patient.lastName}
                                    </td>
                                    <td className={dataCellClassName}>{patient.address}</td>
                                    <td className={dataCellClassName}>{patient.city}</td>
                                    <td className={dataCellClassName}>{patient.state}</td>
                                    <td className={dataCellClassName}>{patient.zipCode}</td>
                                    <td className={dataCellClassName}>{patient.phoneNumber}</td>
                                    <td className={dataCellClassName}>{patient.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;