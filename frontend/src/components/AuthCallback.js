import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // Store the token
      localStorage.setItem('token', token);
      // Set axios default header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Fetch full user profile from backend
      (async () => {
        try {
          const response = await axios.get('/api/auth/dashboard');
          const user = response.data.user;
          await login(null, null, token, user);
          toast.success('Successfully signed in with Google!');
          navigate('/dashboard');
        } catch (error) {
          console.error('Failed to fetch user profile after Google login:', error);
          toast.error('Authentication failed');
          navigate('/login');
        }
      })();
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