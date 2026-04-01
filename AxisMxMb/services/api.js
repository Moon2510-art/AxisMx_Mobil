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
      const response = await api.post('/usuarios', userData);
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
      const response = await api.put(`/usuarios/${id}`, userData);
      if (response.data.success === false) {
        return { success: false, message: response.data.message };
      }
      return { success: true, data: response.data, message: 'Usuario actualizado exitosamente' };
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      if (error.response) {
        return { success: false, message: error.response.data.message || 'Error al actualizar usuario' };
      }
      return { success: false, message: 'Error de conexión con el servidor' };
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
};

export const vehicleService = {
  getAll: async () => {
    try {
      const response = await api.get('/vehiculos');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al obtener vehículos:', error);
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
      const response = await api.post('/vehiculos', vehicleData);
      return { success: true, data: response.data, message: 'Vehículo creado exitosamente' };
    } catch (error) {
      console.error('Error al crear vehículo:', error);
      if (error.response?.data?.errors) {
        const errors = Object.values(error.response.data.errors).flat();
        return { success: false, message: errors.join(', ') };
      }
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
      return { success: false, message: error.response?.data?.message || 'Error al eliminar vehículo' };
    }
  },
};
export const modeloService = {
  getAll: async () => {
    try {
      const response = await api.get('/modelos');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al obtener modelos:', error);
      return { success: false, message: error.response?.data?.message || 'Error al cargar modelos' };
    }
  },
};

export const marcaService = {
  getAll: async () => {
    try {
      const response = await api.get('/marcas');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al obtener marcas:', error);
      return { success: false, message: error.response?.data?.message || 'Error al cargar marcas' };
    }
  },
};

export const tipoAccesoService = {
  getAll: async () => {
    try {
      const response = await api.get('/tipos-acceso');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al obtener tipos de acceso:', error);
      return { success: false, message: error.response?.data?.message || 'Error al cargar tipos de acceso' };
    }
  },
};

export const visitanteService = {
  getAll: async () => {
    try {
      const response = await api.get('/visitantes');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al obtener visitantes:', error);
      return { success: false, message: error.response?.data?.message || 'Error al cargar visitantes' };
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`/usuarios/${id}`, data);
      if (response.data.success === false) {
        return { success: false, message: response.data.message };
      }
      return { success: true, message: 'Visitante actualizado exitosamente' };
    } catch (error) {
      console.error('Error al actualizar visitante:', error);
      if (error.response) {
        return { success: false, message: error.response.data.message || 'Error al actualizar visitante' };
      }
      return { success: false, message: 'Error de conexión con el servidor' };
    }
  },
};

export const rolService = {
  getAll: async () => {
    try {
      const response = await api.get('/roles');
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error al obtener roles:', error);
      return { success: false, message: error.response?.data?.message || 'Error al cargar roles' };
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`/roles/${id}`, data);
      return { success: true, data: response.data, message: 'Rol actualizado exitosamente' };
    } catch (error) {
      console.error('Error al actualizar rol:', error);
      return { success: false, message: error.response?.data?.message || 'Error al actualizar rol' };
    }
  },

  create: async (data) => {
    try {
      const response = await api.post('/roles', data);
      return { success: true, data: response.data, message: 'Rol creado exitosamente' };
    } catch (error) {
      console.error('Error al crear rol:', error);
      return { success: false, message: error.response?.data?.message || 'Error al crear rol' };
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/roles/${id}`);
      return { success: true, message: 'Rol eliminado exitosamente' };
    } catch (error) {
      console.error('Error al eliminar rol:', error);
      return { success: false, message: error.response?.data?.message || 'Error al eliminar rol' };
    }
  },
};

export const accessService = {
  getAll: async () => {
    try {
      const response = await api.get('/accesos'); // Tu endpoint real
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.mensaje || 'Error al obtener accesos' };
    }
  },
};



export default api; // <--- Esto exporta api por defecto
// authService ya está exportado arriba como export const