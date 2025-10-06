import React, { useState } from 'react';
import type { RegistrationFormData, Beneficiary, Executor, Guardian, AssetDistribution } from '../../types/forms'; 
import FormNavigation from './FormNavigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

interface ReviewStepProps {
    formData: RegistrationFormData;
    onPrevious: () => void;
    onEditStep: (stepNumber: number) => void; // Function to jump to a specific step
    // The function that handles the FINAL SUBMISSION
    // Use the main form data type for the entire submission object
    onSubmit: (data: RegistrationFormData) => void; 
    isSubmitting: boolean;
}

interface ReviewSectionProps {
    title: string;
    onEdit: () => void;
    children: React.ReactNode;
}

// >>> FINAL FIX: Define types without 'any' <<<
// ValueType covers all primitive values expected in your form data fields.
type ValueType = string | number | null | undefined; 

// Define a simple indexable type using ValueType
type IndexableItem = { id?: string | number; [key: string]: ValueType; };


// Utility component for a collapsible review section (remains the same)
const ReviewSection: React.FC<ReviewSectionProps> = ({ title, onEdit, children }) => {
    // Local State to manage expansion
    const [isExpanded, setIsExpanded] = useState(true); // To state expanding by default

    const toggleExpansion = () => {
        setIsExpanded(prev => !prev);
    };

    return (
        <div className="bg-white p-6 mb-8 rounded-sm shadow-md border">
            {/* Header Area (Clickable) */}
            <div 
                className="flex justify-between items-center cursor-pointer select-none w-full" 
                onClick={toggleExpansion} // Toggle state on click
            >
                {/* Title and Expansion Icon */}
                <h4 className="text-lg font-semibold text-gray-800 flex justify-between w-full">
                    {title}
                    <FontAwesomeIcon 
                        icon={isExpanded ? faChevronUp : faChevronDown} 
                        className={`ml-3 p-1 h-2 w-2 text-sm text-white bg-[#FF6606] rounded-full transition-transform duration-300`}
                    />
                </h4>
                
            </div>
            {/* Content Area (Collapsible) */}
            <div 
                className={`
                    transition-all ease-in-out duration-500 overflow-hidden
                    ${isExpanded
                        ? 'max-h-[2000px] opacity-100 mt-4 pt-4 border-t border-gray-200' // Expanded state
                        : 'max-h-0 opacity-0 border-t-0'           //Collapsed stete
                    }
                `}
            >
                {/* Inner Content - this is where your DataField components live */}
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-sm`}>
                    {children}
                </div>
                {/* Edit Button */}
                <div className='flex justify-end items-center'>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation(); // Stop the click from triggering toggleExpansion
                            onEdit();
                        }}
                        className="text-sm font-semibold underline underline-offset-4 text-[#353535] hover:text-orange-700 transition duration-150 font-poppins"
                    >
                        Edit
                    </button>
                </div>
            </div>
            
        </div>
    );
};

// Utility function for displaying simple data fields (remains the same)
const DataField: React.FC<{ label: string; value: string | null | undefined }> = ({ label, value }) => {
    // Set a default display value
    const displayValue = value || 'N/A';

    // Define the common Tailwind classes for form elements
    const inputClasses = "w-full p-3 border border-gray-300 bg-gray-50 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-0";

    return (
        <div className="flex flex-col space-y-1 py-1">
            {/* Label (Styled like an input label) */}
            <label className="text-sm font-medium text-gray-600">
                {label}
            </label>

            {/* Value (Styled like a disabled input field) */}
            <div className={inputClasses}>
                {displayValue}
            </div>
        </div>
    );
};


const ReviewStep = ({ formData, onPrevious, onSubmit, onEditStep, isSubmitting }: ReviewStepProps) => {
    
    // NOTE: For the Review Step, we assume isFormValid is TRUE if the user has reached here.
    // However, if there are final terms/conditions to check, you'd add state here.
    const isFormValid = true; 
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isFormValid) {
            // This is where the FINAL SUBMISSION is triggered
            // Pass the entire formData object or a summary if needed
            onSubmit(formData); 
        }
    };

    // CREATE A BENEFICIARY LOOUP MAP
    const beneficiaryNameMap = new Map(
        formData.stepThree.map(b => [b.id, `${b.firstName} ${b.lastName}`])
    );

    // Helper to render array data
    type ArrayData = Beneficiary[] | Executor[] | Guardian[] | AssetDistribution[];
    const renderArrayData = (dataArray: ArrayData, step: number, sectionTitle: string, fieldMap: { label: string; key: string }[]) => (
        <ReviewSection 
            title={sectionTitle} 
            onEdit={() => onEditStep(step)}
        >
            {/* FIX: Use double assertion (as unknown as IndexableItem) to resolve error 2352 */}
            {dataArray.map((item, itemIndex) => {
                const indexableItem = item as unknown as IndexableItem;

                // 2. DEFINE THE DISPLAY FIELD MAP (Add this block)
                const displayFieldMap = fieldMap.map(field => {
                    let displayValue = String(indexableItem[field.key]);
                    let label = field.label;

                    // CHECK FOR THE BENEFICIARY ID FIELD
                    if (field.key === "beneficiaryId") {
                        // Look up the name from the map
                        displayValue = beneficiaryNameMap.get(displayValue) || 'Beneficiary Not Found';
                        label = 'Beneficiary Name'; // Change the label to be more user-friendly
                    }
                    
                    return { label, value: displayValue };
                });
                return (
                    <div 
                        key={indexableItem.id || itemIndex} 
                        className={`col-span-1 md:col-span-2 ${itemIndex > 0 ? 'mt-4 pt-4 border-t border-dashed border-gray-300' : ''}`}
                    >
                        <h5 className="font-bold text-md mb-2 text-gray-700">{sectionTitle.slice(0, -1)} #{itemIndex + 1}</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                            {/* USE THE NEW displayFieldMap */}
                            {displayFieldMap.map(field => (
                                <DataField 
                                    key={field.label} // Use label as key since it's unique per section
                                    label={field.label} 
                                    value={field.value} 
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </ReviewSection>
    );
    
    // Field maps for array data (Asserted to { label: string; key: string }[] for renderArrayData compatibility)
    const beneficiaryMap = [
        { label: "First Name", key: "firstName" }, { label: "Last Name", key: "lastName" },
        { label: "Date of Birth", key: "dateOfBirth" }, { label: "Gender", key: "gender" }
    ] as { label: string; key: string }[];
    const executorMap = [
        { label: "Type", key: "executorType" }, { label: "Name", key: "name" },
        { label: "Phone", key: "phone" }, { label: "Address", key: "address" },
        { label: "State", key: "state" }, { label: "City", key: "city" }
    ] as { label: string; key: string }[];
    const guardianMap = [
        { label: "First Name", key: "firstName" }, { label: "Last Name", key: "lastName" },
        { label: "Phone", key: "phone" }, { label: "Relationship", key: "relationship" },
        { label: "Address", key: "address" }, { label: "City", key: "city" }, { label: "State", key: "state" }
    ] as { label: string; key: string }[];
    const assetDistributionMap = [
        { label: "BeneficiaryID", key: "beneficiaryId" }, 
        { label: "Asset", key: "assetName" },
        { label: "Percentage", key: "percentage" }
    ] as { label: string; key: string }[];


    return (
        <form onSubmit={handleSubmit} className="bg-gray-50">
            <h3 className="">Information Preview</h3>

            {/* Step 1: Personal Details */}
            <ReviewSection title="Personal Details" onEdit={() => onEditStep(1)}>
                <DataField label="Place of Birth" value={formData.stepOne.placeOfBirth} />
                <DataField label="Religion" value={formData.stepOne.religion} />
                <DataField label="Gender" value={formData.stepOne.gender} />
                <DataField label="Home Address" value={formData.stepOne.homeAddress} />
                <DataField label="City" value={formData.stepOne.city} />
                <DataField label="State" value={formData.stepOne.state} />
                <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-x-8">
                    {/* Placeholder for images */}
                    <div className="my-2"><span className="font-medium text-gray-500">Passport Photo:</span> {formData.stepOne.passportPhoto ? 'Uploaded' : 'Missing'}</div>
                    <div className="my-2"><span className="font-medium text-gray-500">Signature:</span> {formData.stepOne.signature ? 'Uploaded' : 'Missing'}</div>
                </div>
            </ReviewSection>

            {/* Step 2: Identification Details */}
            <ReviewSection title="Identification Details" onEdit={() => onEditStep(2)}>
                <DataField label="ID Type" value={formData.stepTwo.idType} />
                <DataField label="ID Number" value={formData.stepTwo.idNumber} />
                <div className="col-span-1 md:col-span-2 my-2"><span className="font-medium text-gray-500">ID Image:</span> {formData.stepTwo.idImage ? 'Uploaded' : 'Missing'}</div>
            </ReviewSection>

            {/* Step 3: Beneficiary Details */}
            {renderArrayData(formData.stepThree, 3, "Beneficiary Details", beneficiaryMap)}

            {/* Step 4: Executors Details */}
            {renderArrayData(formData.stepFour, 4, "Executors Details", executorMap)}

            {/* Step 5: Guardians Details */}
            {renderArrayData(formData.stepFive, 5, "Guardians Details", guardianMap)}

            {/* Step 6: RSA Assets */}
            <ReviewSection title="RSA Assets" onEdit={() => onEditStep(6)}>
                <DataField label="Name" value={formData.stepSix.name} />
                <DataField label="RSA PIN Number" value={formData.stepSix.rsaPinNumber} />
                <DataField label="PFA" value={formData.stepSix.pfa} />
                <DataField label="Salary Bank" value={formData.stepSix.salaryBankName} />
                <DataField label="Salary Account No." value={formData.stepSix.salaryAccountNumber} />
            </ReviewSection>

            {/* Step 7: Beneficiary Asset % */}
            {renderArrayData(formData.stepSeven, 7, "Beneficiary Asset %", assetDistributionMap)}


            {/* Final Navigation */}
            <FormNavigation
                onPrevious={onPrevious}
                isSubmitting={isSubmitting}
                isFormValid={true} 
                showPreviousButton={true}
                isFinalStep={true} // Indicate this is the final submit button
            />
        </form>
    );
};

export default ReviewStep;