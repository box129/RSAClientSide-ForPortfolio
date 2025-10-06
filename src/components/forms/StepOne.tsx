import React, { useState } from 'react';
import type { StepOneData } from '../../types/forms';
import { FileInput } from './FileInput';
import FormNavigation from './FormNavigation';

interface StepOneProps {
  onSubmit: (data: StepOneData) => void; 
  onPrevious: () => void; // Assuming you added this from the previous multi-step logic
  // The isSubmitting prop from the mutation hook
  isSubmitting: boolean; 
}

const StepOne = ({ onSubmit, onPrevious, isSubmitting }: StepOneProps) => {
    const [personalDetails, setPersonalDetails] = useState<StepOneData>({
        placeOfBirth: '',
        religion: '',
        gender: '',
        homeAddress: '',
        city: '',
        state: '',
        passportPhoto: null,
        signature: null,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setPersonalDetails({ ...personalDetails, [e.target.name]: e.target.value });
    };

    // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof StepOneData) => {
    //     const file = e.target.files ? e.target.files[0] : null;
    //     setPersonalDetails({ ...personalDetails, [fieldName]: file });
    // };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
         // You might add client-side validation here before submitting
        // The check remains here to determine if the form is valid
        if (isFormValid) {
             onSubmit(personalDetails); // Now passes StepOneData type
        }
        // onSubmit(personalDetails); 
    };

    // Define validation logic for Step One
    const isFormValid = !!personalDetails.placeOfBirth && 
                        !!personalDetails.religion && 
                        !!personalDetails.gender && 
                        !!personalDetails.homeAddress && 
                        !!personalDetails.city && 
                        !!personalDetails.state &&
                        !!personalDetails.passportPhoto && 
                        !!personalDetails.signature;


    return (
        <div className="bg-white">
            <h3 className="">Personal Details</h3>
            <form onSubmit={handleSubmit}>
                <div className="p-6">
                    <div className="threeStep-inputs">
                    
                        {/* 1. Place of Birth (Input) */}
                        <div className="">
                            <label htmlFor="placeOfBirth">Place of Birth</label>
                            <input
                                type="text"
                                name="placeOfBirth"
                                id="placeOfBirth"
                                value={personalDetails.placeOfBirth}
                                onChange={handleChange}
                                // className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-[#FF6606] focus:border-[#FF6606]"
                                required
                            />
                        </div>
                    
                        {/* 2. Religion (Select) */}
                        <div className="">
                            <label htmlFor="religion">Religion</label>
                            <select
                                name="religion"
                                id="religion"
                                value={personalDetails.religion}
                                onChange={handleChange}
                                className=""
                                required
                            >
                                <option value="">Select Religion</option>
                                {/* Add real options here */}
                                <option value="Christianity">Christianity</option>
                                <option value="Islam">Islam</option>
                            </select>
                            {/* Custom arrow if needed */}
                        </div>
                        {/* 3. Gender (Select) */}
                        <div className="">
                            <label htmlFor="gender">Gender</label>
                            <select
                                name="gender"
                                id="gender"
                                value={personalDetails.gender}
                                onChange={handleChange}
                                className=""
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        {/* 4. Home Address (Input) */}
                        <div className="">
                            <label htmlFor="homeAddress">Home Address</label>
                            <input
                                type="text"
                                name="homeAddress"
                                id="homeAddress"
                                value={personalDetails.homeAddress}
                                onChange={handleChange}
                                // className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-[#FF6606] focus:border-[#FF6606]"
                                required
                            />
                        </div>
                        {/* 5. City (Select) */}
                        <div className="">
                            <label htmlFor="city">City</label>
                            <select
                                name="city"
                                id="city"
                                value={personalDetails.city}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select City</option>
                                {/* Add real options here */}
                                <option value="Lagos">Lagos</option>
                                <option value="Abuja">Abuja</option>
                            </select>
                        </div>
                        {/* 6. State (Select) */}
                        <div className="">
                            <label htmlFor="state">State</label>
                            <select
                                name="state"
                                id="state"
                                value={personalDetails.state}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select State</option>
                                {/* Add real options here */}
                                <option value="LagosState">Lagos State</option>
                                <option value="AbujaFCT">Abuja FCT</option>
                            </select>
                        </div>
                        {/* 7. Upload Passport Photograph (File Input) */}
                        <div className="">
                            <label className="">Upload your passport photograph</label>
                            <FileInput
                                name="passportPhoto"
                                onChange={(file) => setPersonalDetails(prev => ({ ...prev, passportPhoto: file }))}
                                currentFile={personalDetails.passportPhoto}
                            />
                        </div>
                        {/* 8. Upload Signature (File Input) */}
                        <div className="">
                            <label className="">Upload your signature</label>
                            <FileInput
                                name="signature"
                                onChange={(file) => setPersonalDetails(prev => ({ ...prev, signature: file }))}
                                currentFile={personalDetails.signature}
                            />
                        </div>
                    </div>
                    {/* NEW: Use the common FormNavigation component */}
                    <FormNavigation
                        onPrevious={onPrevious}
                        isSubmitting={isSubmitting}
                        isFormValid={isFormValid}
                        showPreviousButton={false} // CRITICAL: Hide the previous button for Step 1
                    />
                </div>
            </form>
        </div>
    )
}

export default StepOne;