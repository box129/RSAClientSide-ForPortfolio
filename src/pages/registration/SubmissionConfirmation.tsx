import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const SubmissionConfirmation = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white border border-gray-200 rounded-lg shadow-xl mx-auto">
                {/* Line */}
                <div className='h-0.5 w-[102%] bg-[#D1D5DB] relative top-10'/>
                <div className="p-8 md:p-12 flex flex-col items-center justify-center">
                    
                    <div className="flex flex-col size-[80%] pb-10">
                        <DotLottieReact
                            src="https://lottie.host/89874c39-6038-46b0-8b63-8a831d4eac94/W75ZJrwW6l.lottie"
                            loop
                            autoplay
                        />
                    </div>
                    {/* Success Message */}
                    <h2 className="text-xl md:text-2xl font-semibold text-center text-gray-600">
                        Your will form has been submitted successfully to Leadway Trustees for<br/> review and approval.
                    </h2>
                    
                    {/* Optional: Add a button to go back to the dashboard or home */}
                    {/*
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="mt-6 px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition duration-150"
                    >
                        Go to Dashboard
                    </button>
                    */}
                </div>
            </div>
        </div>
    );
};

export default SubmissionConfirmation;