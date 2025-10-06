import React, { useState } from 'react';
import type { StepFourData, Executor, ExecutorType } from '../../types/forms';
import FormNavigation from './FormNavigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faTrashAlt, faCircleInfo, faCircleCheck, faCircle } from '@fortawesome/free-solid-svg-icons';
import { INITIAL_EXECUTOR, BLANK_INDIVIDUAL_EXECUTOR_TEMPLATE } from '../../types/constants';
import { v4 as uuidv4 } from 'uuid';

interface StepFourProps {
    onSubmit: (data: StepFourData) => void;
    onPrevious: () => void;
    isSubmitting: boolean;
}

const StepFour = ({ onSubmit, onPrevious, isSubmitting }: StepFourProps) => {
    // Initialize with the default executor
    const [executors, setExecutors] = useState<StepFourData>([INITIAL_EXECUTOR]);
    const MAX_EXECUTORS = 3;

    // --- Handlers ---

    const handleExecutorChange = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setExecutors(prev => 
            prev.map((item, i) => (
                i === index ? { ...item, [name]: value } : item
            ))
        );
    };

    const handleTypeChange = (index: number, type: ExecutorType) => {
        setExecutors(prev => 
            prev.map((item, i) => {
                if (i === index) {
                    //Reset name fields when switching type
                    const newItem: Executor = { ...item, executorType: type };
                    if (type === 'Individual Executor') {
                        // When switching to Individual, initialize to empty string (or keep current if non-undefined)
                        // This assignment is now compatible with 'string | undefined'
                        newItem.firstName = item.firstName === undefined ? '' : item.firstName;
                        newItem.lastName = item.lastName === undefined ? '' : item.lastName;
                    } else {
                        newItem.firstName = undefined;
                        newItem.lastName = undefined;
                    }
                    return newItem;
                }
                return item;
            })
        );
    };

    const handleAddExecutor = () => {
        if (executors.length < MAX_EXECUTORS) {
            const newExecutor: Executor = {
                ...BLANK_INDIVIDUAL_EXECUTOR_TEMPLATE, 
                id: uuidv4(),
            } as Executor; // Cast to Executor to satisfy type
            setExecutors(prev => [...prev, newExecutor]);
        }
    };

    const handleRemoveExecutor = (id: string) => {
        // Prevent removal of the default executor (index 0)
        if (executors.length > 1 && executors[0].id !== id) {
            setExecutors(prev => prev.filter(item => item.id !== id));
        }
    };

    // --- Validation ---

    const isExecutorValid = (e: Executor) => {
        const baseValid = !!e.name && !!e.phone && !!e.address && !!e.state && !!e.city;

        if (e.executorType === 'Individual Executor') {
            return baseValid && !!e.firstName && !!e.lastName;
        }
        // Leadway Trustees is pre-filled and assumed valid, other company executors are simpler
        return baseValid;
    };

    const isFormValid = executors.length >= 1 && executors.every(isExecutorValid);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isFormValid) {
            onSubmit(executors);
        }
    };

    return (
        <div className="p-6 max-w-full cursor-default">
            <h3 className="">Executors Details</h3>
            
            <p className="text-sm text-center mb-6 text-[#5A5A5A]">
                <FontAwesomeIcon icon={faCircleInfo} className='text-[#FF6606]' />
                <span className="font-bold"> Appoint Executors</span> (minimum of 1, maximum of 3 required) (Leadway Trustees serves as a default executor)
            </p>

            <form onSubmit={handleSubmit}>
                {executors.map((executor, index) => (
                    <div key={executor.id} className="mb-8 p-6">
                        {/* Header/Remove Button */}
                        <div className="flex justify-between items-center mb-6">
                             <h4 className="text-lg font-medium text-[#FF6606]">{executor.name ? executor.name : `Executor #${index + 1}`}</h4>
                            
                            {executor.id !== INITIAL_EXECUTOR.id && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveExecutor(executor.id)}
                                    className="text-red-500 hover:text-red-700 transition duration-150 text-sm"
                                    disabled={executors.length <= 1}
                                >
                                    <FontAwesomeIcon icon={faTrashAlt} className="mr-1" />
                                    Remove Executor
                                </button>
                            )}
                        </div>

                        {/* Executor Fields */}
                        <div className="threeStep-inputs">
                            
                            {/* Executor Name */}
                            <div className="md:col-span-2">
                                <label className="">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={executor.name}
                                    onChange={(e) => handleExecutorChange(index, e)}
                                    readOnly={executor.id === INITIAL_EXECUTOR.id}
                                    required
                                    className={`border ${executor.id === INITIAL_EXECUTOR.id ? 'bg-gray-100' : ''}`}
                                />
                            </div>

                            {/* Executor Type Selector (Hidden for Default Executor) */}
                            {executor.id !== INITIAL_EXECUTOR.id && (
                                <div className="md:col-span-2 mt-4">
                                    <label className="">Select Executor Type</label>
                                    <div className="flex gap-4">
                                        {['Individual Executor', 'Company Executor'].map((type) => (
                                            <div key={type} className="flex items-center">
                                                <input
                                                    type="radio"
                                                    id={`${executor.id}-${type}`}
                                                    name={`${executor.id}-executorType`}
                                                    value={type}
                                                    checked={executor.executorType === type}
                                                    onChange={() => handleTypeChange(index, type as ExecutorType)}
                                                    // className="w-4 h-4 text-[#FF6606] border-gray-300 focus:ring-[#FF6606]"
                                                    // HIDE THE NATIVE INPUT, USE 'peer' utility
                                                    className="hidden peer"
                                                />
                                                {/* <label htmlFor={`${executor.id}-${type}`} className="ml-2 text-sm text-gray-700 cursor-pointer">{type}</label> */}
                                                {/* 2. Custom visual element (Label) */}
                                                <label 
                                                    htmlFor={`${executor.id}-${type}`} 
                                                    // className="flex items-center cursor-pointer text-gray-700 font-medium gap-4"
                                                   className={`
                                                        flex items-center cursor-pointer font-medium gap-2 
                                                        transition-colors duration-200
                                                        ${executor.executorType === type ? 'text-[#FF6606]' : 'text-gray-700'} 
                                                    `}
                                                >
                                                    {type}
                                                    {/* Conditional Icon Logic - Now correctly placed BEFORE text and inheriting color */}
                                                    <span className="w-5 h-5 flex items-center justify-center">
                                                        {executor.executorType === type ? (
                                                            // SELECTED: Icon inherits 'text-[#FF6606]' from parent label
                                                            <FontAwesomeIcon 
                                                                icon={faCircleCheck} 
                                                                className="text-xl" 
                                                            />
                                                        ) : (
                                                            // UNSELECTED: Icon is explicitly gray
                                                            <FontAwesomeIcon 
                                                                icon={faCircle} 
                                                                className="text-gray-400 text-xl" 
                                                            />
                                                        )}
                                                    </span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Individual Executor Fields (First & Last Name) */}
                            {executor.executorType === 'Individual Executor' && executor.id !== INITIAL_EXECUTOR.id && (
                                <>
                                    <div className="">
                                        <label className="">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={executor.firstName || ''}
                                            onChange={(e) => handleExecutorChange(index, e)}
                                            required
                                            className="border"
                                        />
                                    </div>
                                    <div className="">
                                        <label className="">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={executor.lastName || ''}
                                            onChange={(e) => handleExecutorChange(index, e)}
                                            required
                                            className="border"
                                        />
                                    </div>
                                </>
                            )}
                            
                            {/* Phone Number */}
                            <div className="">
                                <label className="">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={executor.phone}
                                    onChange={(e) => handleExecutorChange(index, e)}
                                    readOnly={executor.id === INITIAL_EXECUTOR.id}
                                    required
                                    className={`border ${executor.id === INITIAL_EXECUTOR.id ? 'bg-gray-100' : ''}`}
                                />
                            </div>
                            
                            {/* Address */}
                            <div className="">
                                <label className="">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={executor.address}
                                    onChange={(e) => handleExecutorChange(index, e)}
                                    readOnly={executor.id === INITIAL_EXECUTOR.id}
                                    required
                                    className={`border ${executor.id === INITIAL_EXECUTOR.id ? 'bg-gray-100' : ''}`}
                                />
                            </div>
                            
                            {/* State */}
                            <div className="">
                                <label className="">State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={executor.state}
                                    onChange={(e) => handleExecutorChange(index, e)}
                                    readOnly={executor.id === INITIAL_EXECUTOR.id}
                                    required
                                    className={`border ${executor.id === INITIAL_EXECUTOR.id ? 'bg-gray-100' : ''}`}
                                />
                            </div>
                            
                            {/* City */}
                            <div className="">
                                <label className="">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={executor.city}
                                    onChange={(e) => handleExecutorChange(index, e)}
                                    readOnly={executor.id === INITIAL_EXECUTOR.id}
                                    required
                                    className={`border ${executor.id === INITIAL_EXECUTOR.id ? 'bg-gray-100' : ''}`}
                                />
                            </div>
                        </div>
                    </div>
                ))}
                
                {/* Add Another Executor Button */}
                {executors.length < MAX_EXECUTORS && (
                    <div className='flex justify-end items-start px-6'>
                        <button
                            type="button"
                            onClick={handleAddExecutor}
                            className="text-center text-[#353535] font-semibold hover:text-orange-700 transition duration-150"
                        >
                            <FontAwesomeIcon icon={faPlusCircle} className="mr-2 text-xl" />
                             Appoint Another Executor
                        </button>
                    </div>
                )}

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

export default StepFour;
