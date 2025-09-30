import { useContext } from "react";
import { RegistrationContext } from '../context/RegistrationContext';

// Create a custom hook to use the context
export const useRegistrationData = () => {
    const context = useContext(RegistrationContext);
    if (context === undefined) {
        throw new Error('useRegistrationData must be used within a RegistrationProvider');
    }
    return context;
}