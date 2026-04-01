import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/api';

const { width } = Dimensions.get('window');

export default function DashboardUsuario({ navigation }) {
  const [fontsLoaded] = useFonts({
    Ultra: require("../assets/fonts/DelaGothicOne-Regular.ttf"),
  });

  const { user, userRole, logout } = useAuth();
  const [stats, setStats] = useState({ mis_accesos_mes: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargarEstadisticas = async () => {
    try {
      // Obtener el ID correcto (puede estar en id o ID_Usuario)
      const userId = user?.id || user?.ID_Usuario;
      console.log('🟢 userId:', userId);
      
      if (!userId) {
        console.log('❌ No hay userId');
        setLoading(false);
        return;
      }
      
      const result = await dashboardService.getUserStats(userId);
      console.log('🟢 Resultado stats:', result);
      
      if (result.success) {
        console.log('✅ Datos:', result.data);
        setStats(result.data);
      }
    } catch (error) {
      console.error('🔴 Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarEstadisticas();
    setRefreshing(false);
  };

  useEffect(() => {
    if (user) {
      cargarEstadisticas();
    } else {
      setLoading(false);
    }
  }, [user]); // Dependencia en user para que se ejecute cuando esté disponible

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres salir?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Salir', onPress: () => logout(), style: 'destructive' }
      ]
    );
  };

  const handleChangePassword = () => {
    navigation.navigate('CambiarPassword');
  };

  if (!fontsLoaded) return null;

  const nombreUsuario = user?.nombre || user?.Nombre || 'Usuario';
  const estadoUsuario = user?.ID_Estado === 1 ? 'ACTIVO' : 'INACTIVO';
  const estadoColor = user?.ID_Estado === 1 ? '#4CAF50' : '#f44336';

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#114B5F" />
        <Text style={styles.loadingText}>Sincronizando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.contenedor}>
      <ScrollView
        contentContainerStyle={styles.areaScroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#114B5F']} />
        }
      >
        {/* ENCABEZADO */}
        <View style={styles.headerContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.saludoMini}>Hola de nuevo,</Text>
            <Text style={styles.nombreUltra} numberOfLines={1}>{nombreUsuario}</Text>
            <View style={styles.badgeContainer}>
              <View style={[styles.statusBadge, { backgroundColor: estadoColor }]}>
                <Text style={styles.badgeTexto}>{estadoUsuario}</Text>
              </View>
              <View style={styles.rolBadge}>
                <Text style={styles.rolTexto}>{userRole?.toUpperCase() || 'USUARIO'}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.perfilCircle} 
            onPress={() => navigation.navigate('Perfil')}
          >
            <Icon name="person" size={30} color="#114B5F" />
          </TouchableOpacity>
        </View>

        {/* ACCESO RÁPIDO: CREDENCIAL */}
        <TouchableOpacity 
          style={styles.cardPrincipal} 
          onPress={() => navigation.navigate('Credencial')}
        >
          <View style={styles.iconCircle}>
            <Icon name="qr-code" size={32} color="#FFF" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitleUltra}>MI CREDENCIAL</Text>
            <Text style={styles.cardSubtitle}>Código de acceso digital</Text>
          </View>
          <Icon name="chevron-forward" size={24} color="#114B5F" />
        </TouchableOpacity>

        {/* ESTADÍSTICAS PERSONALES */}
        <Text style={styles.seccionTitulo}>Resumen Mensual</Text>
        <View style={styles.gridStats}>
          <View style={styles.statCard}>
            <Text style={styles.statNumero}>{stats.mis_accesos_mes}</Text>
            <Text style={styles.statLabel}>Entradas</Text>
          </View>
          <TouchableOpacity 
            style={[styles.statCard, { backgroundColor: '#114B5F' }]}
            onPress={() => navigation.navigate('Accesos')}
          >
            <Icon name="time-outline" size={24} color="#FFF" />
            <Text style={[styles.statLabel, { color: '#FFF', marginTop: 5 }]}>Historial</Text>
          </TouchableOpacity>
        </View>

        {/* MENÚ DE OPCIONES */}
        <Text style={styles.seccionTitulo}>Gestión de Cuenta</Text>
        <View style={styles.menuContainer}>
          <TouchableOpacity 
            style={styles.menuRow} 
            onPress={() => navigation.navigate('Vehículos')}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#E3F2FD' }]}>
              <Icon name="car" size={22} color="#114B5F" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuLabel}>Mis Vehículos</Text>
              <Text style={styles.menuSub}>Gestionar unidades registradas</Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>

          {/* CAMBIAR CONTRASEÑA */}
          <TouchableOpacity 
            style={styles.menuRow} 
            onPress={handleChangePassword}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#FFF3E0' }]}>
              <Icon name="lock-closed" size={22} color="#FF9800" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuLabel}>Cambiar Contraseña</Text>
              <Text style={styles.menuSub}>Actualizar tu clave de acceso</Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>

          {/* CERRAR SESIÓN */}
          <TouchableOpacity 
            style={[styles.menuRow, { borderBottomWidth: 0 }]} 
            onPress={handleLogout}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#FFEBEE' }]}>
              <Icon name="log-out" size={22} color="#f44336" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.menuLabel, { color: '#f44336' }]}>Cerrar Sesión</Text>
              <Text style={styles.menuSub}>Salir de tu cuenta</Text>
            </View>
            <Icon name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>
        </View>

        <View style={styles.footerSpacing}>
          <Text style={styles.version}>AxisMX v1.0.0 • UPQ</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#C8DFEA' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#C8DFEA' },
  loadingText: { marginTop: 10, color: '#365563', fontWeight: '600' },
  areaScroll: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    marginTop: 10
  },
  saludoMini: { fontSize: 14, color: '#365563', marginBottom: -2 },
  nombreUltra: { fontSize: 24, color: '#114B5F', fontFamily: "Ultra" },
  badgeContainer: { flexDirection: 'row', gap: 8, marginTop: 8 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6 },
  badgeTexto: { fontSize: 9, color: '#FFF', fontWeight: '900' },
  rolBadge: { backgroundColor: '#FFF', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6, elevation: 1 },
  rolTexto: { fontSize: 9, color: '#114B5F', fontWeight: '900' },
  perfilCircle: { 
    width: 55, 
    height: 55, 
    borderRadius: 28, 
    backgroundColor: '#FFF', 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 4,
  },

  cardPrincipal: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    elevation: 3,
  },
  iconCircle: { width: 55, height: 55, borderRadius: 15, backgroundColor: '#114B5F', justifyContent: 'center', alignItems: 'center' },
  cardContent: { flex: 1, marginLeft: 15 },
  cardTitleUltra: { fontSize: 16, fontFamily: 'Ultra', color: '#114B5F' },
  cardSubtitle: { fontSize: 12, color: '#888' },

  seccionTitulo: { fontSize: 15, fontWeight: '800', color: '#365563', marginBottom: 15, marginLeft: 5 },

  gridStats: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  statCard: { 
    width: '48%', 
    backgroundColor: '#FFF', 
    borderRadius: 20, 
    padding: 20, 
    alignItems: 'center', 
    elevation: 2 
  },
  statNumero: { fontSize: 32, fontWeight: 'bold', color: '#114B5F' },
  statLabel: { fontSize: 12, color: '#666', fontWeight: '600' },

  menuContainer: { backgroundColor: '#FFF', borderRadius: 20, padding: 10, elevation: 2 },
  menuRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 12, 
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5'
  },
  menuIconBox: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  menuLabel: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  menuSub: { fontSize: 11, color: '#999' },

  footerSpacing: { marginTop: 40, marginBottom: 20 },
  version: { textAlign: 'center', color: '#999', fontSize: 11 }
});