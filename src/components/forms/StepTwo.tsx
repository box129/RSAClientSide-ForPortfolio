import React, {useState} from 'react';
import type { IdentificationType, StepTwoData } from '../../types/forms';
import { FileInput } from './FileInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPassport, faIdCardClip, type IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faIdCard, faAddressCard } from '@fortawesome/free-regular-svg-icons';
import FormNavigation from './FormNavigation';

// Definition for the identification buttons
const ID_OPTIONS: { type: IdentificationType, label: string, icon: IconDefinition }[] = [
    { type: 'International Passport', label: 'Int\'l Passport', icon: faPassport },
    { type: 'Driver\'s License', label: 'Driver\'s Card', icon: faIdCard },
    { type: 'Voter\'s Card', label: 'Voter\'s Card', icon: faIdCardClip },
    { type: 'BVN', label: 'BVN', icon: faAddressCard },
];

interface StepTwoProps {
    onSubmit: (data: StepTwoData) => void;
    onPrevious: () => void;
    isSubmitting: boolean;
}

const StepTwo = ({ onSubmit, onPrevious, isSubmitting }: StepTwoProps) => {
    const [idDetails, setIdDetails] = useState<StepTwoData>({
        idType: '',
        idNumber: '',
        idImage: null,
    });

    const handleIdSelect = (type: IdentificationType) => {
        // Reset idNumber and idImage when the type changes
        setIdDetails(prev => ({
            ...prev,
            idType: type,
            idNumber: '',
            idImage: null
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIdDetails(prev => ({ ...prev, idNumber: e.target.value }));
    };

    const handleFileChange = (file: File | null) => {
        setIdDetails(prev => ({ ...prev, idImage: file }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Add client-side validation logic here
        // The check remains here to determine if the form is valid
        if (isFormValid) {
             onSubmit(idDetails);
        }
    };

    const { idType, idNumber, idImage } = idDetails;
    // Determine form validity for the 'Proceed' button
    const isFormValid = !!idType && !!idNumber && !!idImage; 

    return (
        <div className="p-6 bg-white">
            <h3 className="">Select Identification Type</h3>

            <form onSubmit={handleSubmit}>
                {/* ID Type Selection Buttons */}
                <div className="flex justify-around mb-12">
                    {ID_OPTIONS.map((option) => (
                        <div
                            key={option.type}
                            onClick={() => handleIdSelect(option.type)}
                            className={`group p-6 border-2 rounded-lg cursor-pointer transition duration-300 w-36 h-40 text-center flex flex-col justify-between
                                ${idType === option.type
                                    ? 'bg-[#FF6606] border-[#FF6606] text-white'
                                    : 'border-gray-200 text-[#FF6606] bg-white hover:bg-[#FF6606] hover:text-white hover:border-[#FF6606] hover:shadow-lg'
                                }`
                            }
                        >
                            {/* Render the specific icon from the 'option' object  */}
                            <div className="text-4xl mb-2">
                                <FontAwesomeIcon icon={option.icon} />
                            </div>
                            <span className={`
                                ${idType === option.type
                                    ? 'text-white' 
                                    : 'text-[#525F7F] group-hover:text-white'
                                }`}
                            >
                                {option.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Input Fields (Conditional based on selection for real-world) */}
                {idType && (
                    <div className="form-entry">
                        {/* License/ID Number Input */}
                        <div className="input-group">
                            <label className="text-gray-600 mb-2">Enter {idType === 'BVN' ? 'BVN' : 'License Number'}</label>
                            <input
                                type="text"
                                name="idNumber"
                                value={idNumber}
                                onChange={handleChange}
                                required
                                className="border border-gray-300 p-3 rounded-lg focus:ring focus:ring-orange-200 transition duration-150"
                            />
                        </div>
                        
                        {/* OR separator */}
                        <span className="text-gray-500 text-lg mt-10" >
                            or
                        </span>

                        {/* File Upload Input */}
                        <div className="input-group">
                            <label className="text-gray-600 mb-2">Upload Image of your {idType}</label>
                            <FileInput
                                name="idImage"
                                onChange={(file) => handleFileChange(file)}
                                currentFile={idImage}
                            />
                        </div>
                    </div>
                )}
                

                {/* Navigation Buttons */}

                {/* Using the common FormNavigation component */}
                <FormNavigation
                    onPrevious={onPrevious}
                    isSubmitting={isSubmitting}
                    isFormValid={isFormValid}
                    showPreviousButton={true}
                />
            </form>
        </div>
    )
}

export default StepTwo;