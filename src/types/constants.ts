import { v4 as uuidv4 } from 'uuid';
import type { Beneficiary, Gender, Executor, ExecutorType, Guardian, StepSixData, AssetDistribution } from './forms';

// 1. INITIAL_BENEFICIARY (For initial state in MultiStepForm.tsx)
export const INITIAL_BENEFICIARY: Beneficiary = {
    id: uuidv4(), // Must generate unique ID for initial item
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '' as Gender,
};

// 2. BLANK_BENEFICIARY_TEMPLATE (Template used for adding new beneficiaries)
export const BLANK_BENEFICIARY_TEMPLATE = {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '' as Gender,
};

// 1. INITIAL_EXECUTOR (Used for initial state in MultiStepForm.tsx)
// This must generate a fresh ID here for the initial state.
export const INITIAL_EXECUTOR: Executor = {
    id: uuidv4(), // Unique ID for the *first* executor
    name: 'Leadway Trustees',
    phone: '0807657875',
    address: '121/123 Funsho Williams Avenue, Iponri',
    state: 'Lagos',
    city: 'Surulere',
    executorType: 'Company Executor' as ExecutorType,
    firstName: undefined,
    lastName: undefined,
};

// 2. BLANK_INDIVIDUAL_EXECUTOR_TEMPLATE (Used for adding new executors)
// We will use this template inside StepFour.tsx to avoid using a fixed ID.
export const BLANK_INDIVIDUAL_EXECUTOR_TEMPLATE = {
    name: '',
    phone: '',
    address: '',
    state: '',
    city: '',
    executorType: 'Individual Executor' as ExecutorType,
    firstName: '',
    lastName: '',
};

export const INITIAL_GUARDIAN: Guardian = {
    id: uuidv4(), // Generate a unique ID for the initial entry
    firstName: '',
    lastName: '',
    phone: '',
    relationship: '',
    address: '',
    state: '',
    city: '',
};

export const EMPTY_ASSETS: StepSixData = {
    name: '',
    rsaPinNumber: '',
    pfa: '',
    salaryBankName: '',
    salaryAccountNumber: '',
};

// --- ASSET DISTRIBUTION CONSTANTS (NEW) ---

// Template for a new distribution record (ID will be generated on add)
export const BLANK_DISTRIBUTION_TEMPLATE: Omit<AssetDistribution, 'id'> = {
    beneficiaryId: '',
    assetName: '', 
    percentage: '',
};