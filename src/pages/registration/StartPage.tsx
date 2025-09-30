import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import type { StartRegistrationForm } from '../../types/forms';
import { startRegistration } from '../../services/registrationService';
import { useRegistrationData } from '../../hooks/useRegistrationData'; 

const initialFormData : StartRegistrationForm = {
    rsaPin: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    emailAddress: '',
    dateOfBirth: '',
};
const StartPage = () => {
    const navigate = useNavigate();
    const [ formData, setFormData ] = useState<StartRegistrationForm>(initialFormData);

    const { setRegistrationKey } = useRegistrationData();


    // Use the useMutation hook for the form subsmission
    const { mutate, isPending, isError, error } = useMutation({
        mutationFn: startRegistration,
        onSuccess: (data) => {
            // Correctly get the new registrationKey from the response
            const { registrationKey } = data;
            console.log('Registration started successfully. Registration Key:', registrationKey);
            // Save the registrationKey to the global state
            setRegistrationKey(registrationKey);
            // For now, we'll just navigate to a placeholder route.
            navigate('/registration/payment-option');
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Call the mutate function to trigger the API request
        mutate(formData)
    };
    return (
        <div className=""> 
            <div className="mx-auto">
                <div className="top">
                    <h1>RSA Wills</h1>
                    <p>Kindly fill in your personal details</p>
                </div>
                <div className="form-title">
                    <p>Personal Details</p>
                </div>
                <form onSubmit={handleSubmit} className="">
                    <div className="first-form ">
                        <div className="form-entry">
                            <div className="input-group">
                                {/* RSA Pin */}
                                <label htmlFor="rsaPin">RSA Pin</label>
                                <input
                                    type="text"
                                    id="rsaPin"
                                    name="rsaPin"
                                    value={formData.rsaPin}
                                    onChange={handleChange}
                                />
                            </div>
                            {/* First Name */}
                            <div className="input-group">
                                <label htmlFor="firstName">First Name</label>
                                <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                />
                            </div>
                            {/* Last Name */}
                            <div className="input-group">
                                <label htmlFor="lastName">Last Name</label>
                                <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                />
                            </div>
                            {/* Phone Number */}
                            <div className="input-group">
                                <label htmlFor="phoneNumber">Phone Number</label>
                                <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                />
                            </div>
                            {/* Email Address */}
                            <div className="input-group">
                                <label htmlFor="emailAddress">Email Address</label>
                                <input
                                type="email"
                                id="emailAddress"
                                name="emailAddress"
                                value={formData.emailAddress}
                                onChange={handleChange}
                                />
                            </div>
                            {/* Date of Birth */}
                            <div className="input-group">
                                <label htmlFor="dateOfBirth">Date of Birth</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                    />
                                    {/* <FontAwesomeIcon icon={faCalendar} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FF6606] " /> */}
                                </div>
                            </div>
                        </div>
                        <div className="bottomPage">
                            <p>Make a payment of N40,000</p>
                            <button type="submit" disabled={isPending}>
                                {isPending ? 'Processing...' : 'Proceed'}
                            </button>
                        </div>
                        {isError && <p style={{ color: 'red' }}>{error.message}</p>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StartPage;
