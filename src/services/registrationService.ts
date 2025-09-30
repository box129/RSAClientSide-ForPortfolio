import api from './api';
import type { StartRegistrationForm } from '../types/forms';
import type { StartRegistrationResponse } from '../types/api';
import type { RegistrationFormData, StepData } from '../types/forms';
// This is the function that will be used by TanStack Query's `useMutation` hook
export const startRegistration = async (formData: StartRegistrationForm): Promise<StartRegistrationResponse> => {
  try {
    const response = await api.post<StartRegistrationResponse>('/registration/Start', formData);
    return response.data;
  } catch (error) {
    // It's good practice to log or handle the error here
    console.error('Error starting registration:', error);
    // Re-throw the error so TanStack Query's `onError` callback can catch it
    throw error;
  }
};


// Define the expected payload type for clarity
interface SaveStepPayload {
    stepKey: keyof RegistrationFormData;
    data: StepData; // Ideally, a generic type for step data, but 'any' works for now
    registrationKey: string;
}

// NOTE: We need to handle File uploads (passportPhoto, signature), 
// which typically requires using FormData, not JSON.
// Export the function so it can be used in your useMutation hook
export const saveStepData = async (payload: SaveStepPayload) => {
    console.log(`Submitting Step ${payload.stepKey} data to server for key: ${payload.registrationKey}`);

    // Create a FormData object for file uploads
    const formData = new FormData();
    formData.append('registrationKey', payload.registrationKey);
    formData.append('stepKey', payload.stepKey);

    // FIX: Iterate over payload.data using a cast to Record<string, unknown>.
    // This allows iteration without TypeScript throwing an error due to the 'StepData' union type.
    const dataToAppend = payload.data as unknown as Record<string, unknown>; 

    // Append all data fields, handling File objects specifically
    for (const key in dataToAppend) {
        // Ensure we are not processing prototype properties
        if (Object.prototype.hasOwnProperty.call(dataToAppend, key)) {
            const value = dataToAppend[key];

            if (value instanceof File) {
                // For File objects, append the file directly
                formData.append(key, value, value.name);
            } else if (value !== null && value !== undefined) {
                // For strings, numbers, booleans, append the string representation
                formData.append(key, String(value));
            }
            // Note: Array or complex object values should ideally be stringified before appending
        }
    }
    
    // // Replace this URL with your actual API endpoint
    // const response = await fetch('/api/registration/save-step', {
    //     method: 'POST',
    //     // NOTE: Do NOT set 'Content-Type': 'multipart/form-data'. 
    //     // Fetch handles this automatically when using FormData.
    //     body: formData,
    // });
    
    // if (!response.ok) {
    //     throw new Error('Failed to save step data on the server.');
    // }
    // return response.json(); // Returns the server response

    return true;
};