import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: number;
  email: string;
  role: 'ADMIN' | 'USER';
  iat: number;
  exp: number;
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<'ADMIN' | 'USER' | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        setIsAuthenticated(true);
        setUserRole(decodedToken.role);
        setUserEmail(decodedToken.email);
      } catch (error) {
        console.error('Invalid token:', error);
        logout();
      }
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      setIsAuthenticated(true);
      setUserRole(decodedToken.role);
      setUserEmail(decodedToken.email);
    } catch (error) {
      console.error('Invalid token:', error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserRole(null);
    setUserEmail(null);
  };

  return { isAuthenticated, userRole, userEmail, login, logout };
};