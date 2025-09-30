import { useState, useEffect } from "react";
import { useRegistrationData } from "../../hooks/useRegistrationData";
import { useMutation } from '@tanstack/react-query';
import { saveStepData } from "../../services/registrationService";
import type { RegistrationFormData } from '../../types/forms'; // Import the overall form type
import StepOne from "../../components/forms/StepOne";
import StepTwo from "../../components/forms/StepTwo";

// Define a key-to-type mapping utility
// T must extend the full RegistrationFormData
type GetStepData<K extends keyof RegistrationFormData> = RegistrationFormData[K];

// Key for Session Storage
const STEP_KEY = 'multiStepFormCurrentStep';

const MultiStepForm = () => {
    const { registrationKey } = useRegistrationData();
    // const queryClient = useQueryClient();
    // 1. Initialize state: Read the step from Session Storage, default to 1.
    const [currentStep, setCurrentStep] = useState(() => {
        const savedStep = sessionStorage.getItem(STEP_KEY);
        // use parseInt to convert the string back to a number
        return savedStep ? parseInt(savedStep, 10) : 1;
    });

    // 2. Persist state: Save the currentStep to Session Storage whenever it changes.
    useEffect(() => {
        sessionStorage.setItem(STEP_KEY, String(currentStep));
    }, [currentStep]); // Dependency array ensures this runs only when currentStep changes

    const [formData, setFormData] = useState<RegistrationFormData>({
        // Initialize with default state
      stepOne: { placeOfBirth: '', religion: '', gender: '', homeAddress: '', city: '', state: '', passportPhoto: null, signature: null },
      stepTwo: { idType: '', idNumber: '', idImage: null }
    });

    // Refactor setCurrentStep usage to a simple function
    const handleStepCurrentStep = (step: number) => {
        // Ensure step is within valid range (1 to 7)
        const newStep = Math.min(Math.max(1, step), 7);
        setCurrentStep(newStep);
    }

    // --- MUTATION HOOK ---
    const stepMutation = useMutation({
        mutationFn: saveStepData,
        onSuccess: (serverData, payload) => {
            console.log(`Step ${payload.stepKey} saved successfully. Server response:`, serverData);

            // On Success, advance the step
            handleStepCurrentStep(currentStep + 1);
        },
        onError: (error) => {
            console.error("Step submission failed:", error);
            // Show a user-friendly error message
            // Note: Use a custom UI element for errors, not alert()
            // alert(`Error saving data for Step ${currentStep}: ${error.message}`); 
        }
    });

    // --- MUTATION HANDLER ---
    // This function prepares the payload and triggers the mutation
    // It handles the data from any step (using 'any' for now, ideallu generics)
    const handleStepSubmit = <K extends keyof RegistrationFormData>(stepKey: K, data: GetStepData<K>) => {
        // ****** MAKE SURE TO CHANGE ALL REGISTRATIOKEY CONDITION BACKTO IF FALSE ********
        if(registrationKey) {
            console.error("Cannot submit: No registration key found.");
            return;
        }

        // 1. Update the local state first
        setFormData((prev) => ({ ...prev, [stepKey]: data }));

        // 2. Prepare payload for the server
        const payload = {
            stepKey: stepKey as keyof RegistrationFormData, // e.g., 'stepOne'
            data: data,       // data from the form
            registrationKey: registrationKey,
        };

        // 3. Trigger the mutation
        stepMutation.mutate(payload);
    };

    
    const handlePrevious = () => {
        handleStepCurrentStep(currentStep - 1);
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <StepOne 
                            onSubmit={(data) => handleStepSubmit('stepOne', data)} 
                            // onPrevious={handlePrevious}
                            isSubmitting={stepMutation.isPending}
                        />;
            case 2:
                // Example for Step Two (if it existed)
                return (
                    <StepTwo 
                        onSubmit={(data) => handleStepSubmit('stepTwo', data)} 
                        onPrevious={handlePrevious} 
                        isSubmitting={stepMutation.isPending}
                    />
                );
            default:
                return <div>Form Completed!</div>
        }
    };

    // Check for registration key

    // --- Change the condition back to !registrationKey ---
    if (registrationKey) {
        // Use an early return if the key is missing (corrected logic)
        return <div className="p-8 text-center text-red-600 font-semibold">Error: No registration key found. Please start over.</div>;
    }

  return (
    <div className="flex flex-col items-center min-h-screen">
        <div className="w-full max-w-4xl cobtainer">
            {/* Step Count Message (e.g., "6 more steps to go...") */}
            <div className="sticky top-[100px] w-full bg-white z-40 pt-4">
                <div className="text-3xl font-bold text-center text-gray-800 mb-8">
                    {currentStep <= 7 && currentStep != 1 ? `${8 - currentStep} more steps to go...` : 'Kindly fill the following forms'}
                </div>
                {/* Step Indicator UI - CORRECTED */}
                <div className="relative w-full mb-6">
                    {/* Step circles and connector lines container */}
                    <div className="flex justify-between relative z-10">
                        {Array.from({ length: 7 }, (_, i) => i + 1).map((step) => {
                        const isCompleted = currentStep > step;
                        const isActive = currentStep === step;
                        return (
                            // Step Circle
                            <div key={step} className="flex flex-col border-x-8 border-white items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors duration-300
                                    ${isActive
                                        ? 'bg-white border-4 border-orange-300' // Current Step: Orange with an outline
                                        : isCompleted
                                        ? 'bg-[#FF6606] text-white' // Completed: Solid Orange
                                        : 'bg-white text-gray-500 border-2 border-gray-400' // Pending: White with a gray border
                                    }`
                                    }
                                >
                                    {step}
                                </div>
                                {/* Connector Line (visible only for steps 1-6) */}
                                {step < 7 && (
                                    <div
                                    className={`absolute h-0.5 w-[calc(100%/6)] top-5 transform -translate-y-1/2 transition-all duration-500`}
                                    style={{
                                        left: `${((step - 1) / 6) * 100}%`,
                                        zIndex: -1,
                                        backgroundColor: currentStep > step ? '#FF6606' : '#D1D5DB' // Dynamic line color
                                    }}
                                    />
                                )}
                            </div>
                        );
                        })}
                    </div>
                
                    {/* Progress Bar (The thick bar underneath) */}
                    <div className="h-2 bg-gray-300 rounded-full mt-4">
                        <div
                        className="h-full bg-[#FF6606] rounded-full transition-all duration-500"
                        style={{ width: `${(((currentStep + 1) - 1) / 7) * 100}%` }}
                        />
                    </div>
                </div>
            </div>
            
            {renderStep()}
        </div>
    </div>
  );
};

export default MultiStepForm;