import { createContext, useState } from "react";
import type { ReactNode } from "react";

/* eslint-disable react-refresh/only-export-components */

// Define the shape of your context state
interface RegistrationContextType {
    registrationKey: string | null;
    setRegistrationKey: (id: string) => void;
}

// Create the Context
export const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

// Create a Provider component
interface RegistrationProviderProps {
    children: ReactNode;
}

export const RegistrationProvider = ({ children }: RegistrationProviderProps) => {
    const [registrationKey, setRegistrationKey] = useState<string | null>(null);

    const value = {
        registrationKey,
        setRegistrationKey,
    };

    return (
        <RegistrationContext.Provider value={value}>
            {children}
        </RegistrationContext.Provider>
    );
};