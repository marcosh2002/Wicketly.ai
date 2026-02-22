import React, { createContext, useState, useEffect, useCallback } from 'react';
import { supabase, getCurrentUser, onAuthStateChange } from '../supabaseClient';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // First check localStorage for user data
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        
        // Then check Supabase session
        const profile = await getCurrentUser();
        if (profile) {
          setUser(profile);
          localStorage.setItem('user', JSON.stringify(profile));
        }
      } catch (error) {
        console.error('Auth init error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen to auth state changes
    const { data: { subscription } } = onAuthStateChange((event, session, profile) => {
      if (event === 'SIGNED_IN' && profile) {
        setUser(profile);
        localStorage.setItem('user', JSON.stringify(profile));
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);
  const openSignup = () => setIsSignupOpen(true);
  const closeSignup = () => setIsSignupOpen(false);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('user');
    localStorage.removeItem('token');
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
        loading,
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
