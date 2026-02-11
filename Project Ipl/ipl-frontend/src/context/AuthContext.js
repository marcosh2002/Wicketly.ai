import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, []);

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);
  const openSignup = () => setIsSignupOpen(true);
  const closeSignup = () => setIsSignupOpen(false);

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleAuthSuccess = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    if (token) {
      localStorage.setItem('token', token);
    }
    setIsLoginOpen(false);
    setIsSignupOpen(false);
  };

  const updateUserTokens = useCallback((newTokenBalance) => {
    setUser(prevUser => {
      if (prevUser) {
        const updatedUser = {
          ...prevUser,
          tokens: newTokenBalance
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      }
      return prevUser;
    });
  }, []);

  const requireAuth = (callback) => {
    if (!user) {
      openSignup();
      return false;
    }
    if (callback) callback();
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoginOpen,
        isSignupOpen,
        openLogin,
        closeLogin,
        openSignup,
        closeSignup,
        logout,
        handleAuthSuccess,
        updateUserTokens,
        requireAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
