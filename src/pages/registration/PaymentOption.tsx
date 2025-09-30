import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuildingColumns, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { useMutation } from '@tanstack/react-query';
import { useRegistrationData } from '../../hooks/useRegistrationData';
import { startOtpVerification } from '../../services/otpService';

const PaymentOption = () => {
    const navigate = useNavigate();
    const [ selectedOption, setSelectedOption ] = useState<'sponsored' | 'individual' | null>(null);
    const [workEmail, setWorkEmail] = useState('');
    const { registrationKey } = useRegistrationData();

    const { mutate, isPending } = useMutation({
        mutationFn: (email: string) => startOtpVerification(email, registrationKey as string),
        onSuccess: () => {
            navigate('/registration/otp-verification');
        },
        onError: (error) => {
            console.error("Failed to send OTP:", error);
            // You can set a message state here to display the error to the user
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Only trigger the mutation if the sponsored option is selected
        if (selectedOption === 'sponsored') {
            mutate(workEmail);
        } else {
            // For the 'individual' option, you might navigate directly
            navigate('/registration/otp-verification');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="first-form">
            <div className="surrounding">
                <div>
                    <div className="top">
                        <h1>Select Payment Option</h1>
                        <p></p>
                    </div>

                    {/* Payment Option Cards */}
                    <div className="card-div">
                        {/* Sponsored by Organisation Card */}
                        <div 
                            onClick={() => setSelectedOption('sponsored')}
                            className={`group card
                                ${
                                selectedOption === 'sponsored' 
                                ? 'bg-[#FF6606] border-[#FF6606] text-white shadow-lg'
                                : 'border-gray-200 text-[#FF6606] bg-white shadow-xl hover:bg-[#FF6606] hover:text-white hover:border-[#FF6606] hover:shadow-lg'
                                }`
                            }
                        >
                            <div className="card-icon">
                                <FontAwesomeIcon icon={faBuildingColumns} className="text-4xl mb-4" />
                            </div>
                            {/* Bank icon */}
                            <span 
                                className={`
                                    ${selectedOption === 'sponsored' 
                                    ? 'text-white' 
                                    : 'text-[#525F7F] group-hover:text-white'
                                    }`
                                }>
                                Sponsored by<br/> my organisation
                            </span>
                        </div>

                        {/* Make Payment Card */}
                        <div 
                            onClick={() => setSelectedOption('individual')}
                            className={`group card p-7
                                ${
                                selectedOption === 'individual' 
                                ? 'bg-[#FF6606] border-[#FF6606] text-white shadow-lg'
                                : 'border-gray-200 text-[#FF6606] bg-white shadow-xl hover:bg-[#FF6606] hover:text-white hover:border-[#FF6606] hover:shadow-lg'
                                }`
                            }
                        >
                            <div className="card-icon">
                                <FontAwesomeIcon icon={faCreditCard} className="text-4xl mb-4"/>
                            </div>
                            {/* Credit card icon */}
                            <span className={`
                                    ${selectedOption === 'individual' 
                                    ? 'text-white' 
                                    : 'text-[#525F7F] group-hover:text-white'
                                    }`
                                }
                            >
                                Make Payment
                            </span>
                        </div>
                    </div>

                    {/* Work Email Input (Visible only if 'Sponsored' is selected) */}
                    {selectedOption === 'sponsored' && (
                        <div className="input-group">
                            <label htmlFor="workEmail">Work Email</label>
                            <input
                                type="email"
                                id="workEmail"
                                value={workEmail}
                                onChange={(e) => setWorkEmail(e.target.value)}
                                placeholder="Enter your work email address"
                                className="input-placeholder"
                                required={selectedOption === 'sponsored'}
                            />
                        </div>
                    )}
                    
                    
                </div>
            </div>
            {/* Proceed Button */}
            <div className="but-div">
                <button
                    type="submit"
                    //onClick={handleSubmit}
                    className="but"
                    disabled={!selectedOption || isPending || (selectedOption === 'sponsored' && !workEmail)}
                >
                    {isPending ? 'Processing...' : 'Proceed'}
                </button>
            </div>
        </form>
    );
};

export default PaymentOption;