import React, { useState, useEffect } from 'react';
import type { StepSevenData, AssetDistribution, Beneficiary, StepSixData } from '../../types/forms';
import FormNavigation from './FormNavigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faTrashAlt, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';
import { BLANK_DISTRIBUTION_TEMPLATE } from '../../types/constants'; 

interface StepSevenProps {
    onSubmit: (data: StepSevenData) => void;
    onPrevious: () => void;
    initialData: StepSevenData;
    // We must pass data from previous steps for the dropdowns
    beneficiaries: Beneficiary[]; // List of beneficiaries from Step 3
    asset: StepSixData; // Asset data from Step 6
    isSubmitting: boolean;
}


const StepSeven = ({ onSubmit, onPrevious, initialData, beneficiaries, asset, isSubmitting  }: StepSevenProps) => {
    // Use the PFA asset name as the primary asset
    const primaryAssetOption = `${asset.pfa} account`; // e.g., "Tuluops PFA account"

    // 1. Initialize distributions state
    const [distributions, setDistributions] = useState<StepSevenData>(() => {
        // If initialData is empty, start with one distribution with the assetName pre-set.
        if (initialData.length === 0) {
            return [{ 
                ...BLANK_DISTRIBUTION_TEMPLATE, 
                id: uuidv4(),
                assetName: primaryAssetOption, // Set assetName here
            } as AssetDistribution];
        }
        return initialData;
    });

    // 2. 💡 CRITICAL FIX: Ensure all items always have the correct assetName.
    useEffect(() => {
        // This runs after the component renders and whenever primaryAssetOption changes (if Step 6 changes).
        // It iterates over the current state and forces the assetName to match the prop value.
        const needsUpdate = distributions.some(d => d.assetName !== primaryAssetOption);

        if (needsUpdate) {
            setDistributions(prev => prev.map(d => ({
                ...d,
                assetName: primaryAssetOption,
            })));
        }
    }, [distributions, primaryAssetOption]); // Rerun if distributions or asset name changes

    // --- Data Preparation ---
    const beneficiaryOptions = beneficiaries.map(b => ({
        id: b.id,
        name: `${b.firstName} ${b.lastName}`
    }));
    
    // ---Handlers ---
    const handleChange = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setDistributions(prev => 
            prev.map((item, i) => {
                const updatedValue = value; 
                return i === index ? { ...item, [name]: updatedValue } : item;
            })
        );
    };

    const handleAddDistribution = () => {
        const newDistribution: AssetDistribution = {
            ...BLANK_DISTRIBUTION_TEMPLATE,
            id: uuidv4(),
            assetName: primaryAssetOption, // Already correctly sets assetName for new items
        } as AssetDistribution;

        setDistributions(prev => [...prev, newDistribution]);
    };

    const handleRemoveDistribution = (idToRemove: string) => {
        if (distributions.length > 1) {
            setDistributions(prev => prev.filter(item => item.id !== idToRemove));
        }
    };

    // --- Validation ---
    const isDistributionValid = (d: AssetDistribution) =>
        // assetName will now be non-empty due to the useEffect fix
        !!d.beneficiaryId && !!d.assetName && !!d.percentage;

    // 1. Check basic validity (all fields filled)
    const areAllFieldsFilled = distributions.every(isDistributionValid);

    // 2. Check 100% total
    const totalPercentage = distributions.reduce((sum, d) => {
        const percent = parseFloat(d.percentage) || 0; 
        return sum + percent;
    }, 0);

    // Debugging Logs (Keep these for now)
    console.log('--- Step 7 Validation Check ---');
    console.log('Distributions Array:', distributions);
    console.log('Are all fields filled?', areAllFieldsFilled);
    console.log('Total Percentage Calculated:', totalPercentage);
    console.log('Expected Total Percentage (Rounded):', Math.round(totalPercentage));
    console.log('-----------------------------');


    // The form is valid only if all fields are filled AND the total percentage is 100
    const isFormValid = areAllFieldsFilled && Math.round(totalPercentage) === 100;
    const showPercentageError = areAllFieldsFilled && totalPercentage !== 100;


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isFormValid) {
            onSubmit(distributions);
        }
    };

    return (
        <div className="p-6 bg-white max-w-full">
            <h3 className="">Beneficiary Assets</h3>
            
            <p className="text-sm text-center mb-6 text-[#5A5A5A]">
                <FontAwesomeIcon icon={faCircleInfo} className='text-[#FF6606]' />
                <span className="font-bold"> Note: </span> Share proportion of assets between beneficiaries in percentage (%).
            </p>

            {/* Display total percentage feedback here */}
            {/* {showPercentageError && (
                <div className="text-center text-sm text-red-600 font-bold mb-4 p-2 border border-red-300 bg-red-50 rounded">
                    Total percentage is {totalPercentage}%. It must equal 100% to proceed.
                </div>
            )}
            {areAllFieldsFilled && totalPercentage === 100 && (
                 <div className="text-center text-sm text-green-600 font-bold mb-4">
                    Total percentage is 100%. You may proceed.
                </div>
            )} */}

            {/* Display total percentage feedback here */}
            <div className={`text-center text-sm font-bold mb-4 p-2 border rounded ${isFormValid ? 'text-green-600 border-green-300 bg-green-50' : 'text-red-600 border-red-300 bg-red-50'}`}>
                Current Total Percentage: {Math.round(totalPercentage)}%
                {showPercentageError && totalPercentage !== 100 && (
                    <span className="block font-normal pt-1">Total must equal 100% to proceed.</span>
                )}
            </div>

            <form onSubmit={handleSubmit}>
                {distributions.map((distribution, index) => (
                    <div key={distribution.id} className="mb-8">
                        
                        {/* Remove Button for subsequent distributions */}
                        {index > 0 && (
                            <div className="flex justify-end mb-4">
                                <button
                                    type="button"
                                    onClick={() => handleRemoveDistribution(distribution.id)}
                                    className="text-red-500 hover:text-red-700 transition duration-150 text-sm"
                                    disabled={distributions.length <= 1}
                                >
                                    <FontAwesomeIcon icon={faTrashAlt} className="mr-1" />
                                    Remove
                                </button>
                            </div>
                        )}

                        {/* Distribution Fields */}
                        <div className="threeStep-inputs">
                            
                            {/* Beneficiary Dropdown (Linked to Step 3) */}
                            <div className="">
                                <label className="">Beneficiary</label>
                                <select
                                    name="beneficiaryId"
                                    value={distribution.beneficiaryId}
                                    onChange={(e) => handleChange(index, e)} 
                                    required
                                    className="border"
                                >
                                    <option value="" disabled>Select Beneficiary</option>
                                    {beneficiaryOptions.map(option => (
                                        <option key={option.id} value={option.id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Asset Input (Linked to Step 6) */}
                            <div className="">
                                <label className="">Asset</label>
                                {/* This input is driven by Step 6 data */}
                                <input
                                    type="text"
                                    name="assetName"
                                    value={primaryAssetOption} // Use asset data from props
                                    onChange={(e) => handleChange(index, e)} 
                                    required
                                    readOnly // Make it read-only if it's fixed from Step 6
                                    className="border"
                                />
                            </div>
                            
                            {/* Percentage */}
                            <div className="">
                                <label className="">Percentage (%)</label>
                                <input
                                    // 💡 CRITICAL FIX 3: Add step="1" to enforce whole numbers 
                                    type="number" 
                                    step="1" 
                                    name="percentage"
                                    value={distribution.percentage}
                                    onChange={(e) => handleChange(index, e)} 
                                    min="0"
                                    max="100"
                                    required
                                    className="border"
                                />
                            </div>
                        </div>
                    </div>
                ))}
                
                {/* Add Another Beneficiary Button */}
                <div className='flex justify-end items-start px-6'>
                    <button
                        type="button"
                        onClick={handleAddDistribution}
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
                    isFormValid={isFormValid} // Passes the strict 100% check
                    showPreviousButton={true}
                />
            </form>
        </div>
    );
};

export default StepSeven;
