import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/api';

const { width } = Dimensions.get('window');

export default function Dashboard({ navigation }) {
  const [fontsLoaded] = useFonts({
    Ultra: require("../assets/fonts/DelaGothicOne-Regular.ttf"),
  });

  const { user, userRole } = useAuth();
  const [stats, setStats] = useState({
    total_accesos_hoy: 0,
    accesos_autorizados_hoy: 0,
    accesos_denegados_hoy: 0,
    usuarios_activos: 0,
    vehiculos_registrados: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  const cargarEstadisticas = async () => {
    const result = await dashboardService.getStats();
    if (result.success) {
      setStats(result.data);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarEstadisticas();
    setRefreshing(false);
  };

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  if (!fontsLoaded) return null;

  const nombreUsuario = user ? user.nombre : 'Usuario';

  return (
    <SafeAreaView style={styles.contenedor}>
      <ScrollView 
        contentContainerStyle={styles.areaScroll} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#114B5F']} />
        }
      >
        {/* Encabezado Estilizado */}
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.saludoMini}>Bienvenido de vuelta,</Text>
            <Text style={styles.nombreUltra}>{nombreUsuario}</Text>
            <View style={styles.rolBadge}>
              <Text style={styles.rolTexto}>{userRole?.toUpperCase() || 'USUARIO'}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.perfilCircle} 
            onPress={() => navigation.navigate('Perfil')}
          >
            <Text style={{fontSize: 24}}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Panel de Control de Accesos */}
        <Text style={styles.seccionTitulo}>Estado de Accesos (Hoy)</Text>
        <View style={styles.gridAccesos}>
          <View style={[styles.cardAcceso, { width: '100%', marginBottom: 12, backgroundColor: '#114B5F' }]}>
            <Text style={[styles.numeroGrande, { color: '#FFF' }]}>{stats.total_accesos_hoy}</Text>
            <Text style={[styles.labelAcceso, { color: '#C8DFEA' }]}>Total de Movimientos</Text>
          </View>
          
          <View style={[styles.cardAcceso, { width: '48%', borderColor: '#4CAF50', borderWidth: 1 }]}>
            <Text style={[styles.numeroMedio, { color: '#4CAF50' }]}>{stats.accesos_autorizados_hoy}</Text>
            <Text style={styles.labelAcceso}>Autorizados</Text>
          </View>

          <View style={[styles.cardAcceso, { width: '48%', borderColor: '#F44336', borderWidth: 1 }]}>
            <Text style={[styles.numeroMedio, { color: '#F44336' }]}>{stats.accesos_denegados_hoy}</Text>
            <Text style={styles.labelAcceso}>Denegados</Text>
          </View>
        </View>

        {/* Resumen General del Sistema */}
        <Text style={styles.seccionTitulo}>Resumen General</Text>
        <View style={styles.resumenContainer}>
          <View style={styles.resumenRow}>
            <View style={styles.resumenIconBox}>
              <Text style={{fontSize: 20}}>👥</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.resumenLabel}>Usuarios Activos</Text>
              <Text style={styles.resumenSub}>Personal con acceso vigente</Text>
            </View>
            <Text style={styles.resumenValue}>{stats.usuarios_activos}</Text>
          </View>

          <View style={[styles.resumenRow, { borderBottomWidth: 0 }]}>
            <View style={[styles.resumenIconBox, { backgroundColor: '#FFF3E0' }]}>
              <Text style={{fontSize: 20}}>🚗</Text>
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.resumenLabel}>Vehículos</Text>
              <Text style={styles.resumenSub}>Unidades registradas</Text>
            </View>
            <Text style={[styles.resumenValue, { color: '#FF9800' }]}>{stats.vehiculos_registrados}</Text>
          </View>
        </View>

        {/* Última Actividad */}
        <View style={styles.recientesHeader}>
          <Text style={styles.seccionTitulo}>Última Actividad</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Reportes')}>
            <Text style={styles.verTodo}>Ver reporte</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.cardReciente}>
          <View style={styles.placeholderContainer}>
            <Text style={{fontSize: 30, marginBottom: 10}}>📊</Text>
            <Text style={styles.placeholderText}>Sincronizando logs en tiempo real...</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#C8DFEA' },
  areaScroll: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 },
  
  // Header
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    marginTop: 10
  },
  saludoMini: { fontSize: 14, color: '#365563', marginBottom: -2 },
  nombreUltra: { fontSize: 24, color: '#114B5F', fontFamily: "Ultra" },
  rolBadge: {
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'flex-start',
    elevation: 2,
  },
  rolTexto: { fontSize: 10, color: '#114B5F', fontWeight: '900' },
  perfilCircle: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    backgroundColor: '#FFF', 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#114B5F',
    shadowOpacity: 0.2,
    shadowRadius: 10
  },

  seccionTitulo: {
    fontSize: 16,
    fontWeight: '800',
    color: '#365563',
    marginBottom: 15,
    marginTop: 5,
  },

  // Grid de Accesos
  gridAccesos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  cardAcceso: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  numeroGrande: { fontSize: 42, fontWeight: 'bold' },
  numeroMedio: { fontSize: 28, fontWeight: 'bold' },
  labelAcceso: { fontSize: 12, fontWeight: '600', color: '#666', marginTop: 2 },

  // Resumen
  resumenContainer: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 15,
    marginBottom: 25,
    elevation: 3,
  },
  resumenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  resumenIconBox: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  resumenLabel: { fontSize: 15, fontWeight: 'bold', color: '#114B5F' },
  resumenSub: { fontSize: 11, color: '#999' },
  resumenValue: { fontSize: 20, fontWeight: 'bold', color: '#114B5F' },

  // Recientes
  recientesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  verTodo: { color: '#114B5F', fontWeight: 'bold', fontSize: 13 },
  cardReciente: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#ABBCC4'
  },
  placeholderContainer: { alignItems: 'center', paddingVertical: 20 },
  placeholderText: { color: '#ABBCC4', fontSize: 13, fontWeight: '600' },
});