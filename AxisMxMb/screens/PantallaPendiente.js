import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';

export default function PantallaPendiente() {
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      <View style={styles.content}>
        <Icon name="time-outline" size={100} color="#114B5F" />
        
        <Text style={styles.title}>Cuenta en Revisión</Text>
        
        <Text style={styles.description}>
          Tu registro ha sido recibido con éxito. Un administrador debe validar tu información para activar tu acceso al campus.
        </Text>

        <View style={styles.infoCard}>
          <Icon name="information-circle-outline" size={20} color="#666" />
          <Text style={styles.infoText}>
            Recibirás una notificación cuando tu cuenta sea aprobada.
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.btnSecondary} 
          onPress={logout}
        >
          <Text style={styles.btnText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    padding: 30,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#114B5F',
    marginTop: 20,
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#E8F0F2',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
  },
  infoText: {
    color: '#555',
    fontSize: 13,
    marginLeft: 10,
    flex: 1,
  },
  btnSecondary: {
    width: '100%',
    padding: 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#114B5F',
    alignItems: 'center',
  },
  btnText: {
    color: '#114B5F',
    fontSize: 16,
    fontWeight: 'bold',
  },
});