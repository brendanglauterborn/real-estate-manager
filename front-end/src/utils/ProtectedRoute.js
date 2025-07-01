import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = () => {
  const { currentUser, loading } = useAuth();

  // If loading, show nothing
  if (loading) {
    return <div>Loading...</div>;
  }

  // If not logged in, redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, render the child routes
  return <Outlet />;
};

export default ProtectedRoute; 