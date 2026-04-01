import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { useFocusEffect } from '@react-navigation/native';
import { tipoAccesoService } from '../../services/api';

export default function MetodosAcceso() {
  const [fontsLoaded] = useFonts({
    Ultra: require("../../assets/fonts/DelaGothicOne-Regular.ttf"),
  });

  const [tiposAcceso, setTiposAcceso] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargarTiposAcceso = async () => {
    const result = await tipoAccesoService.getAll();
    if (result.success) {
      setTiposAcceso(result.data);
    } else {
      Alert.alert('Error', result.message);
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarTiposAcceso();
    setRefreshing(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      cargarTiposAcceso();
    }, [])
  );

  if (!fontsLoaded) return null;

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#114B5F" />
        <Text style={styles.loadingText}>Cargando métodos...</Text>
      </View>
    );
  }

  const getIcon = (nombre) => {
    const iconMap = {
      'Peatonal': '🚶',
      'Vehicular': '🚗',
      'Autobús': '🚌',
    };
    return iconMap[nombre] || '🚪';
  };

  return (
    <SafeAreaView style={styles.contenedor}>
      {/* HEADER AL ESTILO USUARIOS */}
      <View style={styles.encabezadoBlanco}>
        <View>
          <Text style={styles.textoTitulo}>Accesos</Text>
          <Text style={styles.subtituloTexto}>Tipos permitidos</Text>
        </View>
        <View style={styles.iconoHeaderContainer}>
            <Text style={{fontSize: 24}}>🛡️</Text>
        </View>
      </View>

      <FlatList
        data={tiposAcceso}
        keyExtractor={(item) => item.ID_Tipo_Acceso.toString()}
        renderItem={({ item }) => (
          <View style={styles.tarjeta}>
            <View style={[styles.decoracionLateral, { backgroundColor: item.Nombre_Tipo === 'Peatonal' ? '#4CAF50' : '#114B5F' }]} />
            
            <View style={styles.contenedorIcono}>
              <Text style={styles.emojiIcono}>{getIcon(item.Nombre_Tipo)}</Text>
            </View>

            <View style={styles.infoCuerpo}>
              <View style={styles.filaTitulo}>
                <Text style={styles.nombreMetodo}>{item.Nombre_Tipo}</Text>
                <View style={styles.badgeId}>
                  <Text style={styles.textoBadge}>ID: {item.ID_Tipo_Acceso}</Text>
                </View>
              </View>
              
              <Text style={styles.descripcionMetodo} numberOfLines={2}>
                {item.Descripcion || 'Sin descripción detallada en el sistema.'}
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listaEspaciado}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#114B5F']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay métodos configurados</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#C8DFEA' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#365563', fontSize: 14 },
  
  encabezadoBlanco: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  textoTitulo: { fontSize: 28, color: '#365563', fontFamily: "Ultra" },
  subtituloTexto: { fontSize: 14, color: '#777', marginTop: -5 },
  iconoHeaderContainer: { backgroundColor: '#C8DFEA', padding: 10, borderRadius: 15 },

  listaEspaciado: { paddingHorizontal: 15, paddingBottom: 30, paddingTop: 10 },
  
  tarjeta: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  decoracionLateral: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
  },
  contenedorIcono: {
    width: 55,
    height: 55,
    borderRadius: 15,
    backgroundColor: '#F0F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  emojiIcono: { fontSize: 26 },
  infoCuerpo: { flex: 1 },
  filaTitulo: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 4 
  },
  nombreMetodo: { fontSize: 18, fontWeight: 'bold', color: '#114B5F' },
  badgeId: { 
    backgroundColor: '#E1E8EB', 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    borderRadius: 6 
  },
  textoBadge: { fontSize: 10, color: '#365563', fontWeight: '700' },
  descripcionMetodo: { fontSize: 13, color: '#666', lineHeight: 18 },

  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#365563', fontSize: 15, opacity: 0.6 },
});