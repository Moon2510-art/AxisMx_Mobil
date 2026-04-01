import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userState, setUserState] = useState(null);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const processUserData = (userData) => {
    if (!userData) return;

    // 1. Extraer Rol de forma segura
    const role = userData.rol?.nombre || userData.rol_nombre || userData.rol;
    
    // 2. Extraer Estado de forma segura
    const state = userData.ID_Estado ?? userData.id_estado ?? userData.estado;

    // 3. Normalizar el objeto de usuario (IMPORTANTE)
    // Forzamos que 'id' siempre sea accesible sin importar cómo venga del backend
    const normalizedUser = {
      ...userData,
      id: userData.id || userData.ID || userData.userId,
      ID_Estado: state
    };

    console.log("--- PROCESANDO USUARIO ---");
    console.log("ID normalizado:", normalizedUser.id);
    console.log("Rol detectado:", role);
    console.log("Estado detectado:", state);
    
    setUser(normalizedUser); // Guardamos el usuario con el ID normalizado
    setUserRole(role);
    setUserState(state !== undefined ? Number(state) : null);
  };

  const loadStoredUser = async () => {
    try {
      const storedUser = await authService.getUser();
      const token = await authService.getToken();
      
      if (storedUser && token) {
        processUserData(storedUser);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setUserRole(null);
        setUserState(null);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('🔐 Iniciando login...');
      const result = await authService.login(email, password);
      
      if (result.success && result.user) {
        processUserData(result.user); // Aquí se normaliza el ID y el Estado
        setIsAuthenticated(true);
        return { success: true };
      }
      
      return { success: false, message: result.message || 'Error de credenciales' };
    } catch (error) {
      console.error('Login error in Context:', error);
      return { success: false, message: 'Error de conexión' };
    }
  };

  const register = async (userData) => {
    return await authService.register(userData);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setUserRole(null);
    setUserState(null);
    setIsAuthenticated(false);
  };

  const isAdminOrSecurity = () => {
    return userRole === 'Administrador' || userRole === 'Seguridad';
  };

  return (
    <AuthContext.Provider
      value={{
        user, // Este ya tiene el .id garantizado por processUserData
        userRole,
        userState,
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