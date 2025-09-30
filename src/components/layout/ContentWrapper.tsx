import type { ReactNode } from 'react';

interface ContentWrapperProps {
  children: ReactNode;
}

// Padding-top set to match the 100px fixed header height (pt-24 is 6rem/96px, close enough to 100px)
const ContentWrapper = ({ children }: ContentWrapperProps) => {
    return (
        <div className="pt-[100px] min-h-screen"> 
            {children}
        </div>
    );
};

export default ContentWrapper;