import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
import Icon from 'react-native-vector-icons/Ionicons';

export default function CredencialDigital({ navigation }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [credencial, setCredencial] = useState(null);

  useEffect(() => {
    if (user?.id) {
      cargarCredencial();
    }
  }, [user]);

  const cargarCredencial = async () => {
    try {
      setLoading(true);
      const result = await userService.getCredencial(user.id);
      
      if (result.success) {
        setCredencial(result.data);
      } else {
        console.warn('Mensaje de API:', result.message);
      }
    } catch (error) {
      console.error('Error cargando credencial:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#114B5F" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  if (!credencial?.codigo) {
    return (
      <SafeAreaView style={styles.containerError}>
        <Icon name="warning-outline" size={80} color="#FFF" />
        <Text style={styles.errorText}>Código no asignado</Text>
        <Text style={styles.errorSubText}>Contacta a administración</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.headerTitle}>Presentar al Lector</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.ocrZone}>
        <Text style={styles.codeLabel}>NÚMERO DE ACCESO</Text>
        
        <Text 
          style={styles.codeValue} 
          numberOfLines={1} 
          adjustsFontSizeToFit
        >
          {credencial.codigo}
        </Text>
        
        <View style={styles.divider} />
        
        <Text style={styles.userName}>
          {user?.nombre} {user?.apellido_paterno}
        </Text>
        <Text style={styles.userId}>ID UPQ: {user?.id}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Asegura que el brillo esté al máximo</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF' 
  },
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#FFF' 
  },
  loadingText: { 
    marginTop: 10, 
    color: '#114B5F' 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    backgroundColor: '#FFF',
  },
  headerTitle: { 
    fontSize: 16, 
    color: '#666', 
    fontWeight: '600' 
  },
  ocrZone: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 20,
  },
  codeLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 10,
  },
  codeValue: {
    fontSize: 80, 
    fontWeight: 'bold',
    color: '#000', 
    letterSpacing: 5, 
    fontFamily: 'monospace', 
    textAlign: 'center',
    width: '100%',
    paddingVertical: 10, 
  },
  divider: {
    height: 2,
    backgroundColor: '#EEE',
    width: '80%',
    marginVertical: 40,
  },
  userName: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#333', 
    textAlign: 'center' 
  },
  userId: { 
    fontSize: 14, 
    color: '#888', 
    marginTop: 5, 
    textAlign: 'center' 
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  footerText: { 
    fontSize: 12, 
    color: '#666', 
    marginLeft: 10 
  },
  containerError: { 
    flex: 1, 
    backgroundColor: '#D32F2F', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  errorText: { 
    color: '#FFF', 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginTop: 20 
  },
  errorSubText: { 
    color: '#FFF', 
    fontSize: 16, 
    marginTop: 10, 
    opacity: 0.8 
  },
});