import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // Store the token and user info
      localStorage.setItem('token', token);
      
      // Decode the token to get user info (basic JWT decode)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const user = {
          id: payload.id,
          email: payload.email,
          is_admin: payload.is_admin
        };
        
        login(user, token);
        toast.success('Successfully signed in with Google!');
        navigate('/dashboard');
      } catch (error) {
        console.error('Token decode error:', error);
        toast.error('Authentication failed');
        navigate('/login');
      }
    } else {
      toast.error('Authentication failed');
      navigate('/login');
    }
  }, [searchParams, login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback; 