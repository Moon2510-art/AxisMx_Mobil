import axios from 'axios';

const API_URL = 'http://192.168.100.4:8000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Variable en memoria para guardar el token (solo mientras la app está abierta)
let currentToken = null;
let currentUser = null;

api.interceptors.request.use(async (config) => {
  if (currentToken) {
    config.headers.Authorization = `Bearer ${currentToken}`;
  }
  return config;
});

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email: email,
        password: password,
      });

      if (response.data.success) {
        // Guardar en memoria, NO en AsyncStorage
        currentToken = response.data.data.token;
        currentUser = response.data.data.user;
        return { success: true, user: response.data.data.user };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        return { success: false, message: error.response.data.message || 'Error en el servidor' };
      }
      return { success: false, message: 'Error de conexión con el servidor' };
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', {
        nombre: userData.nombre,
        apellido_paterno: userData.apellido_paterno,
        apellido_materno: userData.apellido_materno,
        email: userData.email,
        password: userData.password,
        password_confirmation: userData.password_confirmation,
        matricula: userData.matricula,
        numero_empleado: userData.numero_empleado,
        telefono: userData.telefono,
      });

      if (response.data.success) {
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      console.error('Register error:', error);
      if (error.response) {
        if (error.response.data.errors) {
          const errors = Object.values(error.response.data.errors).flat();
          return { success: false, message: errors.join(', ') };
        }
        return { success: false, message: error.response.data.message || 'Error en el servidor' };
      }
      return { success: false, message: 'Error de conexión con el servidor' };
    }
  },

  // Para administradores - obtener usuarios pendientes
  getPendingUsers: async () => {
    try {
      const response = await api.get('/auth/pending-users');
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error' };
    }
  },

  // Para administradores - activar usuario
  activateUser: async (userId) => {
    try {
      const response = await api.put(`/auth/activate-user/${userId}`);
      return { success: true, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error' };
    }
  },

  logout: async () => {
    // Limpiar variables en memoria
    currentToken = null;
    currentUser = null;
  },

  getUser: async () => {
    // Retornar usuario de memoria
    return currentUser;
  },

  getToken: async () => {
    // Retornar token de memoria
    return currentToken;
  },

  isAuthenticated: () => {
    return currentToken !== null;
  },
};

export default api; // <--- Esto exporta api por defecto
// authService ya está exportado arriba como export const