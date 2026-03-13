import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';

export default function Ajustes() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ajustes</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Perfil */}
        <View style={styles.profileSection}>
          <View style={styles.profileImage}>
            <Text style={styles.profileImageText}>👤</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Admin Principal</Text>
            <Text style={styles.profileEmail}>admin@controlacceso.com</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
        </View>

        {/* Preferencias */}
        <Text style={styles.sectionTitle}>Preferencias</Text>
        
        <View style={styles.settingsCard}>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🌙</Text>
              <View>
                <Text style={styles.settingTitle}>Modo Oscuro</Text>
                <Text style={styles.settingDescription}>Tema de la aplicación</Text>
              </View>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#767577", true: "#2c3e50" }}
            />
          </View>
        </View>

        {/* Configuración de Acceso */}
        <Text style={styles.sectionTitle}>Configuración de Acceso</Text>
        
        <View style={styles.settingsCard}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>⏰</Text>
            <Text style={styles.menuText}>Horarios de acceso</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>🚪</Text>
            <Text style={styles.menuText}>Puertas y zonas</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>👥</Text>
            <Text style={styles.menuText}>Niveles de permiso</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Seguridad */}
        <Text style={styles.sectionTitle}>Seguridad</Text>
        
        <View style={styles.settingsCard}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>🔒</Text>
            <Text style={styles.menuText}>Cambiar contraseña</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>📱</Text>
            <Text style={styles.menuText}>Dispositivos autorizados</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={[styles.menuItem, styles.logoutButton]}>
            <Text style={styles.menuIcon}>🚪</Text>
            <Text style={[styles.menuText, styles.logoutText]}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>

        {/* Información de la App */}
        <View style={styles.infoSection}>
          <Text style={styles.appVersion}>Control de Acceso v1.0.0</Text>
          <Text style={styles.appCopyright}>© 2026 Todos los derechos reservados</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2c3e50',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  profileSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2c3e50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileImageText: {
    fontSize: 30,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  profileEmail: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  editButton: {
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#2c3e50',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    marginLeft: 5,
  },
  settingsCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 5,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: 15,
    width: 30,
  },
  settingTitle: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#ecf0f1',
    marginHorizontal: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 15,
    width: 30,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
  },
  menuArrow: {
    fontSize: 24,
    color: '#95a5a6',
  },
  logoutButton: {
    backgroundColor: '#fef5f5',
  },
  logoutText: {
    color: '#e74c3c',
  },
  infoSection: {
    alignItems: 'center',
    padding: 20,
  },
  appVersion: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  appCopyright: {
    fontSize: 12,
    color: '#95a5a6',
    marginTop: 5,
  },
});