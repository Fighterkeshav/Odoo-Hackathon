import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';

const RegisterSuccessPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Welcome to ReWear!
        </h2>
        
        <p className="mt-4 text-lg text-gray-600">
          Your account has been created successfully. You're now part of our sustainable fashion community!
        </p>
        
        <div className="mt-8 space-y-4">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              What's next?
            </h3>
            <ul className="text-sm text-gray-600 space-y-2 text-left">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
                Browse available clothing items
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
                Add your own items to share
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
                Start earning points by giving
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
                Redeem items with your points
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 space-y-3">
          <Link
            to="/dashboard"
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          
          <Link
            to="/"
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterSuccessPage; 