
import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import Layout from '@/components/Layout';

const SignUpPage = () => {
  const { isSignedIn } = useAuth();
  
  if (isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-keeper-purple">Create your Keeper account</h1>
        <SignUp 
          routing="path" 
          path="/signup"
          signInUrl="/login" 
          redirectUrl="/"
        />
      </div>
    </Layout>
  );
};

export default SignUpPage;
