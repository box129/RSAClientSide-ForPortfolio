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
  stepThree: StepThreeData;
  stepFour: StepFourData;
  stepFive: StepFiveData;
  stepSix: StepSixData;
  stepSeven: StepSevenData;
  // Added a placeholder field for the final submission step
  finalSubmission: {
      isSubmitted: boolean;
  }
}


// NEW: Define the union of all step data types
export type StepData = StepOneData | StepTwoData | StepThreeData | StepFourData | StepFiveData | StepSixData | StepSevenData | FinalSubmissionData;

// NEW TYPE: A union of all valid keys
export type RegistrationStepKey = keyof RegistrationFormData | 'finalSubmission'; // Or better: keyof RegistrationFormData

// Update the SaveStepPayload to allow the final key and its data
export interface SaveStepPayload {
  // This allows all standard keys AND the finalSubmission key
  stepKey: keyof RegistrationFormData; 
  data: StepData;
  registrationKey: string;
}

export type IdentificationType = 'International Passport' | 'Driver\'s License' | 'Voter\'s Card' | 'BVN';

// Beneficiary
export type Gender = 'Male' | 'Female' | 'Other' | '';

export interface Beneficiary {
  id: string;
  firstName: string;
  lastName: string;
  // We'll use string for date input value (e.g., "2015-12-25")
  dateOfBirth: string; 
  gender: Gender;
}

// StepThreeData is an array of Beneficiary objects
export type StepThreeData = Beneficiary[];

// **** Executor ****
export type ExecutorType = 'Individual Executor' | 'Company Executor';

export interface Executor {
  // Unique identifier for the executor entry (helpful for state management)
  id: string;
  // General fields (used for all executor types, including default)
  name: string;
  phone: string;
  address: string;
  state: string;
  city: string;

  // Executor type selector
  executorType: ExecutorType | '';

  // Fields specific to individual Executor (optional if type is Company)
  // firstName?: string;
  // lastName?: string;
  firstName: string | undefined;
  lastName: string | undefined;
  // Fields specific to Company Executor (optional if type is Individual)
  // You might add fields here later, but for now, we'll keep it simple.
}

// StepFourData is an array of Executor objects
export type StepFourData = Executor[];


// **** Guardian ****

export interface Guardian {
  // Unique identifier for the guardian entry (helpful for state management)
  id: string;

  firstName: string;
  lastName: string;
  phone: string;
  relationship: string;
  address: string;
  city: string;
  state: string;
}

// StepFiveData is an array of Guardian objects
export type StepFiveData = Guardian[];


// **** ASSETS ****
export interface StepSixData {
  name: string; // Corresponds to the 'Name' field
  rsaPinNumber: string;
  pfa: string;
  salaryBankName: string;
  salaryAccountNumber: string;
}


// @@@ BENEFICIARY ASSETS @@@
export interface AssetDistribution {
  id: string; // Unique ID for this distribution record
  beneficiaryId: string; // ID of the Beneficiary (from Step 3)
  assetName: string; // Name of the asset being distributed (from Step 6)
  percentage: string; // Percentage of the asset given to the beneficiary (should be validated)
}

// StepSevenData is an array of AssetDistribution records
export type StepSevenData = AssetDistribution[]; 

export type FinalSubmissionData = RegistrationFormData['finalSubmission'];