import React, { useState } from 'react';
import type { StepThreeData, Beneficiary } from '../../types/forms';
import FormNavigation from './FormNavigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { INITIAL_BENEFICIARY, BLANK_BENEFICIARY_TEMPLATE } from '../../types/constants';
import { v4 as uuidv4 } from 'uuid';

interface StepThreeProps {
    onSubmit: (data: StepThreeData) => void;
    onPrevious: () => void;
    isSubmitting: boolean;
};

const StepThree = ({ onSubmit, onPrevious, isSubmitting }: StepThreeProps) => {
    // State is an array to hold multiple beneficiaries
    const [beneficiaries, setBeneficiaries] = useState<StepThreeData>([INITIAL_BENEFICIARY]);

    const handleBeneficiaryChange = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setBeneficiaries(prev => 
            prev.map((item, i) => (
                i == index ? { ...item, [name]: value } : item
            ))
        );
    };

    const handleAddBeneficiary = () => {
        const newBeneficiary: Beneficiary = {
            ...BLANK_BENEFICIARY_TEMPLATE,
            id: uuidv4(),
        } as Beneficiary;
        
        setBeneficiaries(prev => [...prev, newBeneficiary]);
    };

    const handleRemoveBeneficiary = (idToRemove: string) => {
        // Only allow removal if there is more than one beneficiary
        if (beneficiaries.length > 1) {
            setBeneficiaries(prev => prev.filter(item => item.id !== idToRemove));
        }
    };

    // Validation Check
    const isBeneficiaryValid = (b: Beneficiary) => 
        !!b.firstName && !!b.lastName && !!b.dateOfBirth && !!b.gender;

    const isFormValid = beneficiaries.every(isBeneficiaryValid);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isFormValid) {
            onSubmit(beneficiaries);
        }
    };

    return (
        <div className="threeStep">
            <h3 className="">Beneficiary Details</h3>

            <form onSubmit={handleSubmit}>
                {beneficiaries.map((beneficiary, index) => (
                    <div 
                        key={beneficiary.id} 
                        className={`mb-8 p-6 rounded-lg ${index > 0 ? ' border-gray-200' : 'border-none p-0'}`}
                    >
                        {/* Header/Remove Button for subsequent beneficiaries */}
                        {index > 0 && (
                            <div className="threeStep-extra">
                                <h4 className="">Beneficiary #{index + 1}</h4>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveBeneficiary(beneficiary.id)}
                                    className=""
                                >
                                    <FontAwesomeIcon icon={faTrashAlt} className="mr-1" />
                                    Remove
                                </button>
                            </div>
                        )}

                        <div className="threeStep-inputs">
                            {/* First Name */}
                            <div className="">
                                <label className="">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={beneficiary.firstName}
                                    onChange={(e) => handleBeneficiaryChange(index, e)}
                                    required
                                    className=""
                                />
                            </div>

                            {/* Last Name */}
                            <div className="">
                                <label className="">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={beneficiary.lastName}
                                    onChange={(e) => handleBeneficiaryChange(index, e)}
                                    required
                                    className=""
                                />
                            </div>

                            {/* Date of Birth (Using a text input with calendar icon for visual) */}
                            <div className="">
                                <label className="">Date of Birth</label>
                                <div className="">
                                    <input
                                        type="date" // Use 'date' type for native date picker functionality
                                        name="dateOfBirth"
                                        value={beneficiary.dateOfBirth}
                                        onChange={(e) => handleBeneficiaryChange(index, e)}
                                        required
                                        className=""
                                    />
                                    {/* <FontAwesomeIcon 
                                        icon={faCalendarDays} 
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                                    /> */}
                                </div>
                            </div>

                            {/* Gender */}
                            <div className="">
                                <label className="">Gender</label>
                                <select
                                    name="gender"
                                    value={beneficiary.gender}
                                    onChange={(e) => handleBeneficiaryChange(index, e)}
                                    required
                                    className=""
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
                
                {/* Add Another Beneficiary Button */}
                <div className='flex justify-end items-start px-6'>
                    <button
                        type="button"
                        onClick={handleAddBeneficiary}
                        className="text-center text-[#353535] font-semibold hover:text-orange-700 transition duration-150"
                    >
                        <FontAwesomeIcon icon={faPlusCircle} className="mr-2 text-xl" />
                        Add Another Beneficiary
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

export default StepThree;