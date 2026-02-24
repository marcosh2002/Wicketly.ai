import { useEffect, useState } from 'react';

/**
 * Custom hook to protect pages and features with authentication
 * Returns user data if logged in, null if not
 * Triggers callback when auth is required but user is not logged in
 */
export function useAuthProtection(onAuthRequired) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // User not logged in - trigger auth required callback
      if (onAuthRequired) {
        onAuthRequired();
      }
    }
    
    setIsLoading(false);
  }, [onAuthRequired]);

  return { user, isLoading };
}
