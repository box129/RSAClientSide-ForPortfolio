export const startOtpVerification = async (email: string, registrationKey: string) => {
  console.log(`Sending email and key to backend for OTP generation: ${email}, ${registrationKey}`);
  // In a real application, you'd make a POST request here
  // await axios.post('/api/start-otp', { email });
  
  // For now, we'll return a mock response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        message: 'OTP sent successfully!'
      });
    }, 1000);
  });
};

// Mock OTP for testing
const MOCK_OTP = '123456';

export const verifyOtp = async (registrationKey: string, otpCode: string) => {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            if (otpCode === MOCK_OTP && registrationKey) { // Added a check for the key
                resolve();
            } else {
                reject(new Error('Invalid OTP. Please try again.'));
            }
        }, 1000);
    });
};

export const resendOtp = async (registrationKey: string) => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      // In a real app, you would have logic here to check for success or failure.
      const success = true; // For now, we'll assume it's always successful.

      if (success) {
        console.log(`Resending OTP for registrationKey: ${registrationKey}`);
        resolve();
      } else {
        // Here is where you would call reject() if the API call failed.
        reject(new Error("Failed to resend OTP. Please try again."));
      }
    }, 1000);
  });
};