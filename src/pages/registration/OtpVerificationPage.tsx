import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useRegistrationData } from '../../hooks/useRegistrationData';
import { verifyOtp, resendOtp } from '../../services/otpService';

const OtpVerificationPage = () => {
    const navigate = useNavigate();
    const { registrationKey  } = useRegistrationData();

    // State for OTP input
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // State for timer and messages
    const [timer,setTimer] = useState(120); // 2 minutes in seconds
    const [isResendActive, setIsResendActive] = useState(false);
    const [message, setMessage] = useState('');

    // TanStack Query mutations for OTP
    const { mutate: verifyMutate, isPending: isVerifying } = useMutation({
        mutationFn: (otpCode: string) => verifyOtp(registrationKey  as string, otpCode),
        onSuccess: () => {
            setMessage('OTP verified successfully!');
            // Navigate to the next step in registration
            navigate('/registration/payment-completed'); 
        },
        onError: (error) => {
            setMessage(error.message);
        },
    });

    const { mutate: resendMutate, isPending: isResending } = useMutation({
        mutationFn: () => resendOtp(registrationKey  as string),
        onSuccess: () => {
            setTimer(120); // Reset timer
            setIsResendActive(false);
            setMessage('New OTP sent!');
        },
        onError: (error) => {
            setMessage(error.message);
        },
    });

    // Effect for timer logic
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer -1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setIsResendActive(true);
        }
    }, [timer]);

    // Handle for OTP input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        if(/[^0-9]/.test(value)) return; // only allow numbers

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const otpCode = otp.join('');
        if (otpCode.length === 6) {
            verifyMutate(otpCode);
        }
    };

    const handleResend = () => {
        if (isResendActive) {
            resendMutate();
        }
    };

    return (
    <div className="first-form">
      <div className="container mx-auto">
        <div>
          <div className="inst-div">
            <h1>OTP Verification</h1>
            <p className="inst">
              Enter the 6 digit code from the SMS sent to your work email address.
            </p>
          </div>
          <div className="text-center font-bold text-[#FF6606] mb-6">
            {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center w-auto">
              <div className="flex justify-center gap-5 mb-6">
                {otp.map((value, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={value}
                    onChange={(e) => handleChange(e, index)}
                    ref={(el) => {
                        inputRefs.current[index] = el;
                    }}
                    // ref={(el) => (inputRefs.current[index] = el)}
                    className={`otp-input
                      ${value ? 'border-[#FF6606] bg-gray-100 text-[#353535]' : 'border-gray-300 text-gray-800'}`}
                  />
                ))}
              </div>
              <div className="otp-error">
                <p className="text-red-500">{message}</p>
                {isResendActive && (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="mt-2 text-sm text-[#FF6606] hover:underline"
                    disabled={isResending}
                  >
                    {isResending ? 'Resending...' : 'Resend OTP'}
                  </button>
                )}
              </div>
            </div>
            <div className="but-div">
              <button
                  type="submit"
                  className="but"
                  disabled={isVerifying || otp.join('').length !== 6}
                >
                  {isVerifying ? 'Verifying...' : 'Submit'}
                </button>
            </div>
              
          </form>
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationPage;