import config from '@/config';
import { ClerkProvider } from '@clerk/nextjs';
import { ReactNode } from 'react';

interface AuthWrapperProps {
  children: ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  if (!config.auth.enabled) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider dynamic>{children}</ClerkProvider>
  )
};

export default AuthWrapper;