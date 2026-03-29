import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFonts } from 'expo-font';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Dashboard({ navigation }) {
  const [fontsLoaded] = useFonts({
    Ultra: require("../assets/fonts/DelaGothicOne-Regular.ttf"),
  });

  const { user, logout, userRole } = useAuth();
  const [stats, setStats] = useState({
    accesosVehiculares: 0,
    accesosPeatonales: 0,
    totalAccesos: 0,
    zonaMasTrafico: 'Cargando...'
  });
  const [accesosRecientes, setAccesosRecientes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Cargar datos al iniciar
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      // Obtener estadísticas de accesos
      const response = await api.get('/access/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }

      // Obtener accesos recientes
      const accesosResponse = await api.get('/access/recent?limit=5');
      if (accesosResponse.data.success) {
        setAccesosRecientes(accesosResponse.data.data);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos');
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await cargarDatos();
    setRefreshing(false);
  }, []);

  const handleLogout = async () => {
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
            // El AuthContext manejará la navegación
          }
        }
      ]
    );
  };

  if (!fontsLoaded) return null;

  // Obtener nombre completo del usuario
  const nombreCompleto = user ? `${user.nombre} ${user.apellido_paterno || ''}` : 'Usuario';

  return (
    <SafeAreaView style={styles.contenedor}>
      <ScrollView 
        contentContainerStyle={styles.areaScroll} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#365563']} />
        }
      >
        {/* 1. Encabezado con Recuadro Blanco */}
        <View style={styles.encabezadoBlanco}>
          <Text style={styles.textoTitulo}>AxisMx</Text>
          <TouchableOpacity style={styles.badgePerfil} onPress={() => navigation.navigate('Perfil')}>
            <View style={styles.iconoPerfil} />
            <Text style={styles.nombrePerfil}>{nombreCompleto.split(' ')[0]}</Text>
          </TouchableOpacity>
        </View>


        {/* 2. Cuadrícula de Estadísticas */}
        <View style={styles.cuadricula}>
          <View style={styles.cajaStat}>
            <Text style={styles.etiquetaStat}>Accesos vehiculares esta semana</Text>
            <Text style={styles.valorStat}>{stats.accesosVehiculares}</Text>
          </View>
          <View style={styles.cajaStat}>
            <Text style={styles.etiquetaStat}>Accesos peatonales esta semana</Text>
            <Text style={styles.valorStat}>{stats.accesosPeatonales}</Text>
          </View>
          <View style={styles.cajaStat}>
            <Text style={styles.etiquetaStat}>Total de accesos semanales </Text>
            <Text style={styles.valorStat}>{stats.totalAccesos}</Text>
          </View>
          <View style={styles.cajaStat}>
            <Text style={styles.etiquetaStat}>Acceso con más tráfico</Text>
            <Text style={[styles.valorStat, { fontSize: 16 }]}>{stats.zonaMasTrafico}</Text>
          </View>
        </View>

        {/* 3. CONTENEDOR DE ACCESOS RECIENTES */}
        <View style={styles.contenedorAccesos}>
          <Text style={styles.tituloSeccion}>Accesos Recientes</Text>

          {accesosRecientes.length === 0 ? (
            <Text style={styles.sinDatos}>No hay accesos recientes</Text>
          ) : (
            accesosRecientes.map((acceso, index) => (
              <TarjetaAcceso 
                key={index}
                datos={{
                  fecha: new Date(acceso.Fecha_Hora).toLocaleString(),
                  usuario: acceso.usuario?.nombre || 'Desconocido',
                  zona: acceso.zona || 'N/A',
                  credencial: acceso.Codigo_Credencial || acceso.Placa || 'N/A',
                  tipo: acceso.tipoAcceso?.Nombre_Tipo || 'N/A',
                  estado: acceso.Acceso_Autorizado ? 'Autorizado' : 'Denegado'
                }} 
              />
            ))
          )}
        </View>

        {/* Mostrar rol del usuario (solo para debug) */}
        <Text style={styles.rolText}>Rol: {userRole}</Text>

      </ScrollView>
    </SafeAreaView>
  )
}

const TarjetaAcceso = ({ datos }) => (
  <View style={styles.tarjetaFila}>
    <Fila label="Fecha y Hora" value={datos.fecha} />
    <Fila label="Usuario" value={datos.usuario} />
    <Fila label="Zona" value={datos.zona} />
    <Fila label="Credencial" value={datos.credencial} />
    <Fila label="Tipo" value={datos.tipo} />
    <Fila label="Estado" value={datos.estado} esUltimo estado={datos.estado} />
  </View>
);

const Fila = ({ label, value, esUltimo, estado }) => {
  const getEstadoColor = () => {
    if (estado === 'Autorizado') return '#4CAF50';
    if (estado === 'Denegado') return '#f44336';
    return '#365563';
  };

  return (
    <View style={[styles.fila, esUltimo && { borderBottomWidth: 0 }]}>
      <View style={styles.colEtiqueta}><Text style={styles.textoEtiqueta}>{label}</Text></View>
      <View style={styles.colValor}>
        {estado ? (
          <Text style={[styles.textoValor, { color: getEstadoColor(), fontWeight: 'bold' }]}>{value}</Text>
        ) : (
          <Text style={styles.textoValor}>{value}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#C8DFEA' },
  areaScroll: { paddingHorizontal: 15, paddingTop: 15, paddingBottom: 110 },
  
  // Encabezado
  encabezadoBlanco: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 15,
    marginBottom: 15,
  },
  textoTitulo: { fontSize: 25, color: '#365563', fontFamily: "Ultra" },
  badgePerfil: { flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 12, borderWidth: 1, borderColor: '#355563' },
  iconoPerfil: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: '#365563', marginRight: 6 },
  nombrePerfil: { color: '#365563', fontSize: 14 },

  logoutButton: {
    backgroundColor: '#f44336',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Stats
  cuadricula: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 5 },
  cajaStat: { width: '48%', backgroundColor: '#FFF', padding: 12, borderRadius: 12, marginBottom: 15, height: 100, justifyContent: 'space-between' },
  etiquetaStat: { fontSize: 11, color: '#608da2', fontFamily: "Ultra" },
  valorStat: { fontSize: 20, color: '#365563', fontFamily: "Ultra" },

  // CONTENEDOR BLANCO DE ACCESOS RECIENTES
  contenedorAccesos: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginTop: 5,
  },
  tituloSeccion: { fontSize: 20, color: '#365563', marginBottom: 15, fontFamily: "Ultra" },
  
  // Tablas internas
  tarjetaFila: { backgroundColor: '#C8DFEA', borderRadius: 8, overflow: 'hidden', marginBottom: 15, borderWidth: 2, borderColor: '#FFF' },
  fila: { flexDirection: 'row', borderBottomWidth: 3, borderBottomColor: '#FFF' },
  colEtiqueta: { width: '38%', backgroundColor: '#365563', padding: 10, justifyContent: 'center' },
  textoEtiqueta: { color: '#FFF', fontSize: 12, fontFamily: "Ultra" },
  colValor: { width: '62%', padding: 10, justifyContent: 'center' },
  textoValor: { color: '#365563', fontSize: 12 },
  sinDatos: { textAlign: 'center', color: '#999', padding: 20 },
  rolText: { textAlign: 'center', color: '#365563', marginTop: 10, fontSize: 12 },
});