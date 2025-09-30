export interface StartRegistrationForm {
  rsaPin: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  dateOfBirth: string;
}

export interface PaymentTransactionForm {
  amount: string;
}

// src/types/forms.ts

// Define the data structure for Step One (Personal Details)
export interface StepOneData {
  placeOfBirth: string;
  religion: string;
  gender: string;
  homeAddress: string;
  city: string;
  state: string;
  // New fields for file uploads
  passportPhoto: File | null;
  signature: File | null;
}

export interface StepTwoData {
  // Stores the selected identification type (e.g., 'Driver\'s License')
    idType: IdentificationType | ''; 
    // The number associated with the ID (e.g., license number, BVN)
    idNumber: string;
    // The uploaded image file
    idImage: File | null;
}

// Define the overall form data structure for the entire multi-step form
export interface RegistrationFormData {
    // Start with Step One's data
    stepOne: StepOneData;
    stepTwo: StepTwoData;
    // Add other steps' data here later
    // stepTwo?: StepTwoData;
}


// NEW: Define the union of all step data types
export type StepData = StepOneData | StepTwoData /* | StepThreeData | ... */;

export type IdentificationType = 'International Passport' | 'Driver\'s License' | 'Voter\'s Card' | 'BVN';
