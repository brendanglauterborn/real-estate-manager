import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './utils/AuthContext';
import ProtectedRoute from './utils/ProtectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';

// Components
import AppNavbar from './components/common/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import ListingsList from './components/listings/ListingsList';
import AddListing from './components/listings/AddListing';
import EditListing from './components/listings/EditListing';
import ListingDetail from './components/listings/ListingDetail';
import Appointments from './components/appointments/Appointments';
import Clients from './components/clients/Clients';

// Redirect component based on authentication status
const HomeRedirect = () => {
  const { currentUser } = useAuth();
  return currentUser ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppNavbar />
        <Routes>
          {/* Home route redirects based on auth status */}
          <Route path="/" element={<HomeRedirect />} />
          
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/listings" element={<ListingsList />} />
            <Route path="/listings/new" element={<AddListing />} />
            <Route path="/listings/edit/:id" element={<EditListing />} />
            <Route path="/listings/:id" element={<ListingDetail />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/clients" element={<Clients />} />
          </Route>
          
          {/* Default route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
