import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, queueApi } from '../services/api.js';

const AuthContext = createContext(undefined);

const DEFAULT_PATIENT = {
  id: 'pat-101',
  name: 'John Doe',
  email: 'patient@example.com',
  role: 'patient',
  phone: '+1 (555) 234-5678',
  age: 34,
  gender: 'Male',
  bloodGroup: 'O+'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('apex_user');
    return saved ? JSON.parse(saved) : DEFAULT_PATIENT;
  });

  const [userToken, setUserToken] = useState(() => {
    return localStorage.getItem('apex_auth_token') || 'mock-jwt-token-pat-101';
  });

  const [activeToken, setActiveTokenState] = useState(() => {
    return localStorage.getItem('apex_active_token') || 'GEN-020';
  });

  const [doctorDetails, setDoctorDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const setActiveToken = (token) => {
    setActiveTokenState(token);
    if (token) {
      localStorage.setItem('apex_active_token', token);
    } else {
      localStorage.removeItem('apex_active_token');
    }
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem('apex_user', JSON.stringify(user));
      if (user.role === 'doctor') {
        const docId = user.doctorId || 'doc-1';
        queueApi.getDoctors().then(docs => {
          const doc = docs.find(d => d.id === docId);
          if (doc) setDoctorDetails(doc);
        }).catch(err => console.error(err));
      }
    } else {
      localStorage.removeItem('apex_user');
    }
  }, [user]);

  const login = async (email, password, role) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(email, password, role);
      if (res.success) {
        setUser(res.user);
        setUserToken(res.token);
        localStorage.setItem('apex_auth_token', res.token);
        if (res.doctorDetails) {
          setDoctorDetails(res.doctorDetails);
        }
      }
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(data);
      if (res.success) {
        setUser(res.user);
        setUserToken(res.token);
        localStorage.setItem('apex_auth_token', res.token);
      }
    } catch (err) {
      console.error('Register error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setUserToken(null);
    setDoctorDetails(null);
    localStorage.removeItem('apex_user');
    localStorage.removeItem('apex_auth_token');
  };

  const switchRole = async (targetRole) => {
    setIsLoading(true);
    try {
      let email = 'patient@example.com';
      if (targetRole === 'doctor') email = 'doctor@example.com';
      if (targetRole === 'admin') email = 'admin@example.com';

      const res = await authApi.login(email, undefined, targetRole);
      if (res.success) {
        setUser(res.user);
        setUserToken(res.token);
        localStorage.setItem('apex_auth_token', res.token);
        if (res.doctorDetails) setDoctorDetails(res.doctorDetails);
      }
    } catch (err) {
      console.error('Switch role error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userToken,
        activeToken,
        doctorDetails,
        isLoading,
        login,
        register,
        logout,
        switchRole,
        setActiveToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
