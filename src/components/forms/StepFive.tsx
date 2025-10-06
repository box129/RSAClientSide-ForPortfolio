import React, { useState } from 'react';
import type { StepFiveData, Guardian } from '../../types/forms';
import FormNavigation from './FormNavigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faTrashAlt, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { INITIAL_GUARDIAN } from '../../types/constants';
import { v4 as uuidv4 } from 'uuid';

interface StepFiveProps {
    onSubmit: (data: StepFiveData) => void;
    onPrevious: () => void;
    isSubmitting: boolean;
}

// Define the shape of the empty guardian *without* a fixed ID
const BLANK_GUARDIAN_TEMPLATE = {
    firstName: '',
    lastName: '',
    phone: '',
    relationship: '',
    address: '',
    state: '',
    city: '',
};

// // Constant for a blank guardian entry
// export const EMPTY_GUARDIAN: Guardian = {
//     id: uuidv4(),
//     firstName: '',
//     lastName: '',
//     phone: '',
//     relationship: '',
//     address: '',
//     state: '',
//     city: '',
// };

const StepFive = ({ onSubmit, onPrevious, isSubmitting }: StepFiveProps) => {
    // State initialized with one empty guardian
    const [guardians, setGuardians] = useState<StepFiveData>([INITIAL_GUARDIAN]);

    // --- Handlers ---
    
    const handleGuardianChange = (
        index: number, 
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setGuardians(prev => 
            prev.map((item, i) => (
                i === index ? { ...item, [name]: value } : item
            ))
        );
    };

    const handleAddGuardian = () => {
        const newGuardian: Guardian = {
            ...BLANK_GUARDIAN_TEMPLATE, 
            id: uuidv4(),
        } as Guardian;
        setGuardians(prev => [...prev, newGuardian]);
    };

    const handleRemoveGuardian = (id: string) => {
        // 💡 NEW DEBUG LINE
        console.log('Attempting to remove Guardian with ID:', id);
        // Must have at least one guardian
        if (guardians.length > 1) {
            setGuardians(prev => prev.filter(item => item.id !== id));
        }
    };

    // --- Validation ---

    const isGuardianValid = (g: Guardian) => 
        !!g.firstName && !!g.lastName && !!g.phone && !!g.relationship && !!g.address && !!g.state && !!g.city;

    const isFormValid = guardians.length >= 1 && guardians.every(isGuardianValid);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isFormValid) {
            onSubmit(guardians);
        }
    };

    return (
        <div className="p-6 bg-white max-w-full">
            <h3 className="">Guardian Details</h3>
            
            <p className="text-sm text-center mb-6 text-[#5A5A5A]">
                <FontAwesomeIcon icon={faCircleInfo} className='text-[#FF6606]' />
                <span className="font-bold"> Note: </span> The persons chosen should be willing to assume this responsibility should the unplanned happen.
            </p>

            <form onSubmit={handleSubmit}>
                {guardians.map((guardian, index) => (
                    <div key={guardian.id} className={`mb-8 p-6 ${index > 0 ? 'border-dashed border-gray-200' : 'border-gray-200'}`}>
                        {/* Header/Remove Button */}
                        <div className="flex justify-between items-center mb-6">
                             <h4 className="text-lg font-medium text-gray-700">Guardian #{index + 1}</h4>
                            
                            {/* Only allow removal if there is more than one guardian */}
                            {index > 0 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveGuardian(guardian.id)}
                                    className="text-red-500 hover:text-red-700 transition duration-150 text-sm"
                                    disabled={guardians.length <= 1}
                                >
                                    <FontAwesomeIcon icon={faTrashAlt} className="mr-1" />
                                    Remove Guardian
                                </button>
                            )}
                        </div>

                        {/* Guardian Fields */}
                        <div className="threeStep-inputs">
                            
                            {/* First Name */}
                            <div className="">
                                <label className="">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={guardian.firstName}
                                    onChange={(e) => handleGuardianChange(index, e)}
                                    required
                                    className="border"
                                />
                            </div>

                            {/* Last Name */}
                            <div className="">
                                <label className="">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={guardian.lastName}
                                    onChange={(e) => handleGuardianChange(index, e)}
                                    required
                                    className="border"
                                />
                            </div>
                            
                            {/* Phone Number */}
                            <div className="">
                                <label className="">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={guardian.phone}
                                    onChange={(e) => handleGuardianChange(index, e)}
                                    required
                                    className="border"
                                />
                            </div>

                            {/* Relationship */}
                            <div className="">
                                <label className="">Relationship</label>
                                <input
                                    type="text"
                                    name="relationship"
                                    value={guardian.relationship}
                                    onChange={(e) => handleGuardianChange(index, e)}
                                    required
                                    className="border"
                                />
                            </div>
                            
                            {/* Address (Using text input, can be swapped for textarea later) */}
                            <div className="">
                                <label className="">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={guardian.address}
                                    onChange={(e) => handleGuardianChange(index, e)}
                                    required
                                    className="border"
                                />
                            </div>
                            
                            {/* City (Using a text input for simplicity for now) */}
                            <div className="">
                                <label className="">City</label>
                                {/* Placeholder for City dropdown */}
                                <input
                                    type="text" 
                                    name="city"
                                    value={guardian.city}
                                    onChange={(e) => handleGuardianChange(index, e)}
                                    required
                                    className="border"
                                />
                            </div>
                            
                            {/* State (Using a text input for simplicity for now) */}
                            <div className="">
                                <label className="">State</label>
                                {/* Placeholder for State dropdown */}
                                <input
                                    type="text"
                                    name="state"
                                    value={guardian.state}
                                    onChange={(e) => handleGuardianChange(index, e)}
                                    required
                                    className="border"
                                />
                            </div>
                        </div>
                    </div>
                ))}
                
                {/* Add Another Guardian Button */}
                <div className='flex justify-end items-start px-6'>
                    <button
                        type="button"
                        onClick={handleAddGuardian}
                        className="text-center text-[#353535] font-semibold hover:text-orange-700 transition duration-150"
                    >
                        <FontAwesomeIcon icon={faPlusCircle} className="mr-2 text-xl" />
                         Add Another Guardian
                    </button>
                </div>

                {/* Navigation */}
                <FormNavigation
                    onPrevious={onPrevious}
                    isSubmitting={isSubmitting}
                    isFormValid={isFormValid}
                    showPreviousButton={true}
                />
            </form>
        </div>
    );
};

export default StepFive;

