// src/pages/registration/PaymentCompletion.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const PaymentCompletion = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            // Navigate to the next step (e.g., the multistep form) after 10 seconds
            navigate('/registration/multistep-form');
        }, 10000); // 10000 milliseconds = 10 seconds

        // Cleanup the timer if the component unmounts
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen">
            <div className="flex justify-center items-center rounded-lg h-[100vh]">
                <div className="border size-[69%] flex items-center justify-center">
                    <div className="flex flex-col size-[80%] pb-10">
                        <DotLottieReact
                            src="https://lottie.host/89874c39-6038-46b0-8b63-8a831d4eac94/W75ZJrwW6l.lottie"
                            loop
                            autoplay
                        />
                        <h2 className="font-poppins text-center font-bold text-[#353535]">OTP Verification Successful!</h2>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentCompletion;
