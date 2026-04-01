import axios from 'axios';

const API_URL = 'http://192.168.100.4:8000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        currentToken = response.data.data.token;
        currentUser = response.data.data.user;
        return { success: true, user: response.data.data.user, token: currentToken };
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
        codigo_credencial: userData.codigo_credencial,
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

  getPendingUsers: async () => {
    try {
      const response = await api.get('/auth/pending-users');
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error' };
    }
  },

  activateUser: async (userId) => {
    try {
      const response = await api.put(`/auth/activate-user/${userId}`);
      return { success: true, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error' };
    }
  },

  changePassword: async (userId, passwordData) => {
    try {
      const response = await api.put(`/auth/change-password/${userId}`, passwordData);
      return { success: true, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error al cambiar contraseña' };
    }
  },

  logout: async () => {
    currentToken = null;
    currentUser = null;
  },

  getUser: async () => currentUser,
  getToken: async () => currentToken,
  isAuthenticated: () => currentToken !== null,
};

export const userService = {
  getAll: async () => {
    try {
      const response = await api.get('/usuarios');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return { success: false, message: error.response?.data?.message || 'Error al cargar usuarios' };
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/usuarios/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Usuario no encontrado' };
    }
  },

  create: async (userData) => {
    try {
      const response = await api.post('/usuarios', {
        nombre: userData.nombre,
        apellido_paterno: userData.apellido_paterno,
        apellido_materno: userData.apellido_materno,
        email: userData.email,
        password: userData.password,
        password_confirmation: userData.password_confirmation,
        matricula: userData.matricula,
        numero_empleado: userData.numero_empleado,
        telefono: userData.telefono,
        ID_Rol: userData.ID_Rol,
        ID_Estado: userData.ID_Estado,
        codigo_credencial: userData.codigo_credencial,
      });
      return { success: true, data: response.data, message: 'Usuario creado exitosamente' };
    } catch (error) {
      console.error('Error al crear usuario:', error);
      if (error.response?.data?.errors) {
        const errors = Object.values(error.response.data.errors).flat();
        return { success: false, message: errors.join(', ') };
      }
      return { success: false, message: error.response?.data?.message || 'Error al crear usuario' };
    }
  },

  update: async (id, userData) => {
    try {
      const response = await api.put(`/usuarios/${id}`, {
        Nombre: userData.Nombre,
        Ap_Paterno: userData.Ap_Paterno,
        Ap_Materno: userData.Ap_Materno,
        Email: userData.Email,
        Telefono: userData.Telefono,
        Matricula: userData.Matricula,
        ID_Rol: userData.ID_Rol,
        ID_Estado: userData.ID_Estado,
        Codigo_Credencial: userData.Codigo_Credencial,
        Password: userData.Password,
      });
      return { success: true, data: response.data, message: 'Usuario actualizado exitosamente' };
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return { success: false, message: error.response?.data?.message || 'Error al actualizar usuario' };
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/usuarios/${id}`);
      return { success: true, message: 'Usuario eliminado exitosamente' };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error al eliminar usuario' };
    }
  },

  getCredencial: async (userId) => {
    try {
      const response = await api.get(`/usuarios/${userId}/credencial`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      console.error('Error en getCredencial:', error);
      return { success: false, message: error.response?.data?.message || 'Error al cargar credencial' };
    }
  },

  getAccesos: async (userId) => {
    try {
      const response = await api.get(`/usuarios/${userId}/accesos`);
      if (response.data.success !== false) {
        return { success: true, data: response.data };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      console.error('Error en getAccesos:', error);
      return { success: false, message: error.response?.data?.message || 'Error al cargar accesos' };
    }
  },

  getVehiculos: async (userId) => {
    try {
      const response = await api.get(`/usuarios/${userId}/vehiculos`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error en getVehiculos:', error);
      return { success: false, message: error.response?.data?.message || 'Error al cargar vehículos' };
    }
  },
};

export const vehicleService = {
  getAll: async () => {
    try {
      const response = await api.get('/vehiculos');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error al cargar vehículos' };
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/vehiculos/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Vehículo no encontrado' };
    }
  },

  create: async (vehicleData) => {
    try {
      const response = await api.post('/vehiculos', {
        Placa: vehicleData.Placa,
        ID_Modelo: vehicleData.ID_Modelo,
        ID_Usuario: vehicleData.ID_Usuario,
        Anio: vehicleData.Anio,
        Color: vehicleData.Color,
        ID_Estado: vehicleData.ID_Estado || 1,
      });
      return { success: true, data: response.data, message: 'Vehículo creado exitosamente' };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error al crear vehículo' };
    }
  },

  update: async (id, vehicleData) => {
    try {
      const response = await api.put(`/vehiculos/${id}`, vehicleData);
      return { success: true, data: response.data, message: 'Vehículo actualizado exitosamente' };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error al actualizar vehículo' };
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/vehiculos/${id}`);
      return { success: true, message: 'Vehículo eliminado exitosamente' };
    } catch (error) {
      console.error('Error al eliminar vehículo:', error);
      return { success: false, message: error.response?.data?.message || 'Error al eliminar vehículo' };
    }
  },

  getByUser: async (userId) => {
    try {
      const response = await api.get(`/vehiculos/usuario/${userId}`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al obtener vehículos del usuario:', error);
      return { success: false, message: error.response?.data?.message || 'Error al cargar vehículos' };
    }
  },

  getModelos: async () => {
    try {
      const response = await api.get('/modelos');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al obtener modelos:', error);
      return { success: false, message: error.response?.data?.message || 'Error al cargar modelos' };
    }
  },

  getMarcas: async () => {
    try {
      const response = await api.get('/marcas');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al obtener marcas:', error);
      return { success: false, message: error.response?.data?.message || 'Error al cargar marcas' };
    }
  },
};

export const accessService = {
  getAll: async () => {
    try {
      const response = await api.get('/accesos');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error al obtener accesos' };
    }
  },

  getUserAccess: async (userId) => {
    try {
      const response = await api.get(`/usuarios/${userId}/accesos`);
      if (response.data.success !== false) {
        return { success: true, data: response.data };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      console.error('Error en getUserAccess:', error);
      return { success: false, message: error.response?.data?.message || 'Error al cargar accesos' };
    }
  },

  getRecent: async () => {
    try {
      const response = await api.get('/access/recent');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al obtener accesos recientes:', error);
      return { success: false, message: error.response?.data?.message || 'Error al cargar accesos' };
    }
  },
};

export const ocrService = {
  recognize: async (imageUri, type) => {
    try {
      const formData = new FormData();
      const fileName = imageUri.split('/').pop();
      const fileType = fileName.split('.').pop();
      
      formData.append('image', {
        uri: imageUri,
        name: `image.${fileType}`,
        type: `image/${fileType}`,
      });
      formData.append('type', type); // 'plate' o 'credential'

      const token = await authService.getToken();
      
      const response = await fetch('http://192.168.100.4:8000/api/ocr', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        if (type === 'plate') {
          return { success: true, placa: data.data.placa };
        } else {
          return { success: true, codigo: data.data.codigo_credencial };
        }
      }
      
      return { success: false, message: data.message };
    } catch (error) {
      console.error('Error en OCR:', error);
      return { success: false, message: 'Error de conexión' };
    }
  },
};

export const dashboardService = {
  getStats: async () => {
    try {
      const response = await api.get('/dashboard/stats');
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error al cargar estadísticas' };
    }
  },

  getUserStats: async (userId) => {
    try {
      const response = await api.get(`/dashboard/user-stats/${userId}`);
      if (response.data.success) {
        return { success: true, data: response.data.data };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error al cargar estadísticas' };
    }
  },
};

export default api;