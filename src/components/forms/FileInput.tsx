import React from 'react';

interface FileInputProps {
    name: string;
    // Function to handle the file being selected/cleared
    onChange: (file: File | null) => void;
    // The currently selected File object (for display purposes)
    currentFile: File | null;
}

/**
 * A reusable component for file uploads.
 * It manages the visual state of the upload and handles file selection/clearing.
 */
export const FileInput = ({ name, onChange, currentFile }: FileInputProps) => {
    // Hidden input refernce to programatically trigger the file dialog
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        // Trigger the hidden file input when the custom button is clicked
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        onChange(file); // Pass the selected file up to the parent form state
    };

    const handleClearFile = () => {
        // Clear file State
        onChange(null);
        // Reset the input element value to allow re-uploading the same file
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const fileName = currentFile ? currentFile.name : '';

    return (
        <div className="flex items-center">
            {/* The Hidden Native File Input */}
            <input
                type="file"
                name={name}
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden" // Keep the native input hidden
                accept="image/png, image/jpeg, application/pdf" // Specify accepted file types
            />

            {/* Display Area */}
            <div className="flex-1 border border-dashed border-gray-400 rounded-lg flex items-center justify-between bg-gray-50 text-sm">
                {fileName ? (
                    <span className="truncate text-gray-800 font-medium">✅ {fileName}</span>
                ) : (
                    <span className="text-gray-500 ml-4">No file selected...</span>
                )}

                {/* Custom Action Button */}
                <button
                    type="button"
                    onClick={fileName ? handleClearFile : handleButtonClick}
                    className={`px-6 py-3 rounded-lg font-semibold transition duration-200 shadow-sm text-sm
                        ${fileName
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`
                    }
                >
                    {fileName ? 'Remove' : 'Upload'}
                </button>
            </div>

            
        </div>
    ); 
}