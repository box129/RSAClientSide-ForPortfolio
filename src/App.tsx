import { Routes, Route } from 'react-router-dom';
import { HashRouter, BrowserRouter } from 'react-router-dom';
import Header from './components/layout/Header';
import ContentWrapper from './components/layout/ContentWrapper';
import StartPage from './pages/registration/StartPage';
import { RegistrationProvider } from './context/RegistrationContext';
import PaymentOption from './pages/registration/PaymentOption';
import OtpVerificationPage from './pages/registration/OtpVerificationPage';
import PaymentCompletion from './pages/registration/PaymentCompletion';
import MultiStepForm from './pages/registration/MultiStepForm';
import SubmissionConfirmation from './pages/registration/SubmissionConfirmation';
// Import other pages as you build them

// Check the environment variable set during the build/runtime
const Router = import.meta.env.VITE_ROUTER_MODE === 'hash' ? HashRouter : BrowserRouter;

function App() {
  return (
    <Router>
      <RegistrationProvider>
        <Header />
         {/* All content inside here will be pushed down by the header's height */}
        <ContentWrapper>
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/registration/payment-option" element={<PaymentOption />} />
            <Route path="/registration/otp-verification" element={<OtpVerificationPage/>}/>
            <Route path="/registration/payment-completed" element={<PaymentCompletion />}/>
            <Route path="/registration/multistep-form" element={<MultiStepForm/>}/>
            <Route path="/registration/submission-confirmation" element={<SubmissionConfirmation/>} />
            {/* TODO: Add other routes here */}
          </Routes>
        </ContentWrapper>
      </RegistrationProvider>
    </Router>
  );
}

export default App;
