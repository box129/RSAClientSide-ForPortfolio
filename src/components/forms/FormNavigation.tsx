// import React from 'react';

interface FormNavigationProps {
    // Action for the 'Previous' button
    onPrevious: () => void;
    // Action for 'Save and Continue Later' (optional, usually hits an API endpoint)
    onSave?: () => void; 
    // State to disable buttons during API submission (from TanStack Query's isPending)
    isSubmitting: boolean;
    // State to determine if the form is valid (e.g., all required fields filled)
    isFormValid: boolean; 
    // Control whether the Previous button is visible (e.g., hide on Step 1)
    showPreviousButton: boolean;
    // Flag to indicate this is the final step
    isFinalStep?: boolean; 
}

const FormNavigation = ({
    onPrevious,
    onSave,
    isSubmitting,
    isFormValid,
    showPreviousButton,
    isFinalStep = false, // Default to false
}: FormNavigationProps) => {

    // Determine the text for the final button
    const finalButtonText = isFinalStep 
        ? (isSubmitting ? 'Submitting...' : 'Submit') 
        : (isSubmitting ? 'Processing...' : 'Proceed');

    return (
        <div className="twoStep">
            
            {/* Previous Button (Conditional) */}
            {showPreviousButton && (
                <button
                    type="button"
                    onClick={onPrevious}
                    className=""
                    disabled={isSubmitting}
                >
                    Previous
                </button>
            )}

            {/* Placeholder to keep the 'Proceed' group aligned right when Previous is hidden */}
            {!showPreviousButton && <div className="w-auto"></div>}

            <div className="flex gap-10 items-center">
                
                {/* Save and Continue Later Button */}
                <button
                    type="button"
                    onClick={onSave}
                    className=""
                    disabled={isSubmitting}
                >
                    Save and Continue Later
                </button>
                
                {/* Submit/Proceed Button */}
                <button
                    type="submit" // CRITICAL: This type makes it trigger the form's onSubmit
                    className=""
                    // Disable if submitting OR if the current form data is NOT valid
                    disabled={isSubmitting || !isFormValid}
                >
                    {finalButtonText} {/* Use the new dynamic text */}
                </button>
            </div>
        </div>
    );
};

export default FormNavigation;