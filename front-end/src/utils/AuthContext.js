import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';

// Create context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on page load
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const { token, agent_id, first_name, last_name } = response.data;
      
      const user = {
        id: agent_id,
        firstName: first_name,
        lastName: last_name,
        email,
        token
      };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  };

  // Register function
  const register = async (agentData) => {
    try {
      const response = await authService.register(agentData);
      const { token, agent_id, first_name, last_name } = response.data;
      
      const user = {
        id: agent_id,
        firstName: first_name,
        lastName: last_name,
        email: agentData.email,
        token
      };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext; 