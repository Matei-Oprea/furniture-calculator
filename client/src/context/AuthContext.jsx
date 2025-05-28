import React, { createContext, useState, useEffect } from 'react';
import { register, login, getCurrentUser } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load user from token on initial load
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await getCurrentUser();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
          setIsAdmin(userData.role === 'admin');
        }
      } catch (error) {
        console.error('Auth error:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const loginUser = async (email, password, isAdmin = false) => {
    try {
      const response = await login(email, password);

      // The response comes directly from the login function
      if (!response || !response.token || !response.user) {
        return {
          success: false,
          message: 'Invalid login response from server'
        };
      }

      const { token, user } = response;

      // Check admin access
      if (isAdmin && user.role !== 'admin') {
        return {
          success: false,
          message: 'Access denied. Admin privileges required.'
        };
      }

      // Store token and update state
      localStorage.setItem('token', token);
      setUser(user);
      setIsAuthenticated(true);
      setIsAdmin(user.role === 'admin');

      return {
        success: true,
        user
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.'
      };
    }
  };

  const registerUser = async (userData) => {
    try {
      const response = await register(userData);

      if (!response || !response.token || !response.user) {
        return {
          success: false,
          message: 'Invalid registration response from server'
        };
      }

      const { token, user } = response;

      localStorage.setItem('token', token);
      setUser(user);
      setIsAuthenticated(true);
      setIsAdmin(user.role === 'admin');

      return {
        success: true,
        user
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please try again.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        loading,
        loginUser,
        registerUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};