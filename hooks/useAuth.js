import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signInWithCredentials = async ({ email, password, callbackUrl, redirect }) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'CredentialsSignin');
      }

      const data = await response.json();
      setUser(data.user);
      
      if (redirect && callbackUrl) {
        window.location.href = callbackUrl;
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  };

  const signUpWithCredentials = async ({ email, password, userData, callbackUrl, redirect }) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          first_name: userData.first_name,
          last_name: userData.last_name,
          age: userData.age
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'EmailCreateAccount');
      }

      const data = await response.json();
      setUser(data.user);

      if (redirect && callbackUrl) {
        window.location.href = callbackUrl;
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return {
    user,
    loading,
    signInWithCredentials,
    signUpWithCredentials,
    signOut,
  };
} 