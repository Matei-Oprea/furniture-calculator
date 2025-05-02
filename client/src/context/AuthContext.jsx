import React, { createContext, useState, useEffect } from 'react';
import { register, login, getCurrentUser } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from token on initial load
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
        
        const userData = await getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
        setIsAdmin(userData.role === 'admin');
      } catch (error) {
        localStorage.removeItem('token');
        setError('Authentication failed. Please log in again.');
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Register user
  const registerUser = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await register(userData);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      setIsAdmin(response.user.role === 'admin');
      setLoading(false);
      return response.user;
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      setLoading(false);
      throw error;
    }
  };

  // Login user
  const loginUser = async (email, password, isAdmin = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await login(email, password);
      
      // If trying to log in as admin but user is not admin
      if (isAdmin && response.user.role !== 'admin') {
        setError('Access denied. Admin privileges required.');
        setLoading(false);
        throw new Error('Access denied. Admin privileges required.');
      }
      
      localStorage.setItem('token', response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      setIsAdmin(response.user.role === 'admin');
      setLoading(false);
      return response.user;
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      setLoading(false);
      throw error;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        loading,
        error,
        registerUser,
        loginUser,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};