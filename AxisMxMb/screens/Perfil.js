import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';

export default function PerfilScreen({ navigation }) {
  const { user, logout, userRole } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar sesión', 
          style: 'destructive',
          onPress: async () => {
            await logout();
          }
        }
      ]
    );
  };

  const menuItems = [
    { 
      icon: 'people-outline', 
      label: 'Usuarios', 
      screen: 'Usuarios', 
      description: 'Gestionar usuarios del sistema'
    },
    { 
      icon: 'car-outline', 
      label: 'Vehículos', 
      screen: 'Vehiculos', 
      description: 'Gestionar vehículos registrados'
    },
    { 
      icon: 'key-outline', 
      label: 'Roles', 
      screen: 'Roles', 
      description: 'Configurar roles y permisos'
    },
    { 
      icon: 'options-outline', 
      label: 'Métodos de Acceso', 
      screen: 'MetodosAcceso', 
      description: 'Configurar tipos de acceso'
    },
    { 
      icon: 'people-circle-outline', 
      label: 'Visitantes', 
      screen: 'Visitantes', 
      description: 'Gestionar visitantes'
    },
  ];
  

  const nombreCompleto = user ? `${user.nombre} ${user.apellido_paterno || ''}` : 'Usuario';
  const email = user?.email || '';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Icon name="person-circle-outline" size={80} color="#fff" />
        </View>
        <Text style={styles.userName}>{nombreCompleto}</Text>
        <Text style={styles.userEmail}>{email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{userRole || 'Usuario'}</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <Text style={styles.menuTitle}>Administración</Text>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Icon name={item.icon} size={24} color="#114B5F" />
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemText}>{item.label}</Text>
              <Text style={styles.menuItemDescription}>{item.description}</Text>
            </View>
            <Icon name="chevron-forward-outline" size={20} color="#999" />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.settingsContainer}>
        <Text style={styles.menuTitle}>Configuración</Text>
        // En PerfilScreen.js buscar el botón de notificaciones:
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => navigation.navigate('Notificaciones')} // <--- Añadir esta línea
        >
          <Icon name="notifications-outline" size={24} color="#114B5F" />
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemText}>Notificaciones</Text>
            <Text style={styles.menuItemDescription}>Configurar alertas</Text>
          </View>
          <Icon name="chevron-forward-outline" size={20} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('CambiarPassword')} // <--- Añadir esto
          >
            <Icon name="lock-closed-outline" size={24} color="#114B5F" />
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemText}>Cambiar contraseña</Text>
              <Text style={styles.menuItemDescription}>Actualizar tu contraseña</Text>
            </View>
            <Icon name="chevron-forward-outline" size={20} color="#999" />
          </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="log-out-outline" size={24} color="#f44336" />
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>AxisMX v1.0.0</Text>
        <Text style={styles.footerText}>Universidad Politécnica de Querétaro</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#114B5F',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 30,
  },
  avatarContainer: {
    marginBottom: 10,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  userEmail: {
    fontSize: 14,
    color: '#C8DFEA',
    marginTop: 5,
  },
  roleBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 10,
  },
  roleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  menuContainer: {
    backgroundColor: '#fff',
    marginTop: 15,
    paddingVertical: 5,
  },
  settingsContainer: {
    backgroundColor: '#fff',
    marginTop: 15,
    paddingVertical: 5,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemContent: {
    flex: 1,
    marginLeft: 15,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  menuItemDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginTop: 15,
    paddingVertical: 15,
  },
  logoutText: {
    fontSize: 16,
    color: '#f44336',
    marginLeft: 10,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 30,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
  
});