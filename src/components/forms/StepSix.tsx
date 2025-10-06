import React, { useState } from 'react';
import type { StepSixData } from '../../types/forms';
import FormNavigation from './FormNavigation';
// import { EMPTY_ASSETS } from '../../types/constants';

interface StepSixProps {
    onSubmit: (data: StepSixData) => void;
    onPrevious: () => void;
    initialData: StepSixData;
    isSubmitting: boolean;
}


const StepSix = ({ onSubmit, onPrevious, initialData, isSubmitting }: StepSixProps) => {
    const [assets, setAssets] = useState<StepSixData>(initialData);

    // --- Handlers ---
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAssets(prev => ({ ...prev, [name]: value }));
    };

    // --- Validation ---
    // Check if all fields are non-empty
    const isFormValid = !!assets.name && !!assets.rsaPinNumber && !!assets.pfa && 
                        !!assets.salaryBankName && !!assets.salaryAccountNumber;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isFormValid) {
            onSubmit(assets);
        }
    };

    return (
        <div className="p-6 bg-white max-w-4xl mx-auto">
            <h3 className="">Assets</h3>
            
            <form onSubmit={handleSubmit}>
                <div className="threeStep-inputs">
                    
                    {/* Name */}
                    <div className="">
                        <label className="">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={assets.name}
                            onChange={handleChange}
                            required
                            className="border"
                        />
                    </div>

                    {/* RSA PIN Number */}
                    <div className="">
                        <label className="">RSA PIN Number</label>
                        <input
                            type="text"
                            name="rsaPinNumber"
                            value={assets.rsaPinNumber}
                            onChange={handleChange}
                            required
                            className="border"
                        />
                    </div>
                    
                    {/* PFA */}
                    <div className="">
                        <label className="">PFA</label>
                        <input
                            type="text"
                            name="pfa"
                            value={assets.pfa}
                            onChange={handleChange}
                            required
                            className="border"
                        />
                    </div>

                    {/* Salary Bank Name */}
                    <div className="">
                        <label className="">Salary Bank Name</label>
                        <input
                            type="text"
                            name="salaryBankName"
                            value={assets.salaryBankName}
                            onChange={handleChange}
                            required
                            className="border"
                        />
                    </div>
                    
                    {/* Salary Account Number */}
                    <div className="">
                        <label className="">Salary Account Number</label>
                        <input
                            type="text"
                            name="salaryAccountNumber"
                            value={assets.salaryAccountNumber}
                            onChange={handleChange}
                            required
                            className="border"
                        />
                    </div>
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

export default StepSix;