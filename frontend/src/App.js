import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RegisterSuccessPage from './pages/RegisterSuccessPage';
import LandingPage from './pages/LandingPage';
import ItemsPage from './pages/ItemsPage';
import ItemDetailPage from './pages/ItemDetailPage';
import AddItemPage from './pages/AddItemPage';
import DashboardPage from './pages/DashboardPage';
import AdminPanel from './pages/AdminPanel';
import WishlistPage from './pages/WishlistPage';
import AuthCallback from './components/AuthCallback';
import Modal from './components/Modal';
import LocationPicker from './components/LocationPicker';

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !user.is_admin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Main App Component
const AppContent = () => {
  const { user, updateUser } = useAuth();
  const [showLocationModal, setShowLocationModal] = useState(false);

  useEffect(() => {
    if (user && (!user.city || !user.country || !user.latitude || !user.longitude || user.city === 'Please update your city')) {
      setShowLocationModal(true);
    } else {
      setShowLocationModal(false);
    }
  }, [user]);

  const handleLocationSet = async (location) => {
    try {
      const response = await fetch(`/api/location/update-location`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(location)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update location');
      }
      
      const result = await response.json();
      updateUser({ ...user, ...location });
      setShowLocationModal(false);
    } catch (error) {
      console.error('Location update error:', error);
      alert('Failed to update location. Please try again.');
    }
  };

  return (
    <>
      <Modal isOpen={showLocationModal} onClose={() => setShowLocationModal(false)}>
        <h2 className="text-xl font-bold mb-4">Set Your Location</h2>
        <p className="mb-4 text-gray-600">Please set your location to continue using ReWear. This helps us show you items near you and enable buying.</p>
        <LocationPicker onLocationSelect={handleLocationSet} initialLocation={user} />
      </Modal>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="pt-16">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
              <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
              <Route path="/register-success" element={<RegisterSuccessPage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/items" element={<ItemsPage />} />
              <Route path="/items/:id" element={<ItemDetailPage />} />
              
              {/* Protected Routes */}
              <Route 
                path="/add-item" 
                element={
                  <ProtectedRoute>
                    <AddItemPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/wishlist" 
                element={
                  <ProtectedRoute>
                    <WishlistPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminPanel />
                  </ProtectedRoute>
                } 
              />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </>
  );
};

// App Component with Providers
const App = () => {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App; 