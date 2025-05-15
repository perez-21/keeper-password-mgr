
import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import Layout from '@/components/Layout';

const Login = () => {
  const { isSignedIn } = useAuth();
  
  if (isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-keeper-purple">Sign in to Keeper</h1>
        <SignIn 
          routing="path" 
          path="/login"
          signUpUrl="/signup" 
          redirectUrl="/"
        />
      </div>
    </Layout>
  );
};

export default Login;
