import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api'; // <--- Importación correcta

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await authService.getUser();
      const token = await authService.getToken();
      
      if (storedUser && token) {
        setUser(storedUser);
        setUserRole(storedUser.rol?.nombre || storedUser.rol);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const result = await authService.login(email, password);
    
    if (result.success) {
      setUser(result.user);
      setUserRole(result.user.rol?.nombre || result.user.rol);
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, message: result.message };
  };

  const register = async (userData) => {
    return await authService.register(userData);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setUserRole(null);
    setIsAuthenticated(false);
  };

  const isAdminOrSecurity = () => {
    return userRole === 'Administrador' || userRole === 'Seguridad';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        loading,
        isAuthenticated,
        isAdminOrSecurity,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};