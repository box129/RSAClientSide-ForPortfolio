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
}

const FormNavigation = ({
    onPrevious,
    onSave,
    isSubmitting,
    isFormValid,
    showPreviousButton,
}: FormNavigationProps) => {

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

            <div className="flex gap-4 items-center">
                
                {/* Save and Continue Later Button */}
                <button
                    type="button"
                    onClick={onSave}
                    className=""
                    disabled={isSubmitting}
                >
                    Save and Continue Later
                </button>
                
                {/* Proceed Button */}
                <button
                    type="submit"
                    className=""
                    // Disable if submitting OR if the current form data is NOT valid
                    disabled={isSubmitting || !isFormValid}
                >
                    {isSubmitting ? 'Processing...' : 'Proceed'}
                </button>
            </div>
        </div>
    );
};

export default FormNavigation;