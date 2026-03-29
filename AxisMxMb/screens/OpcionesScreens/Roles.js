import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { useFocusEffect } from '@react-navigation/native';
import { rolService } from '../../services/api';

export default function Roles() {
  const [fontsLoaded] = useFonts({
    Ultra: require("../../assets/fonts/DelaGothicOne-Regular.ttf"),
  });

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargarRoles = async () => {
    const result = await rolService.getAll();
    if (result.success) {
      setRoles(result.data);
    } else {
      Alert.alert('Error', result.message);
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarRoles();
    setRefreshing(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      cargarRoles();
    }, [])
  );

  if (!fontsLoaded) return null;

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#114B5F" />
      </View>
    );
  }

  // Función para asignar un icono y color según el peso del rol
  const getRolStyle = (nombre) => {
    const lowerName = nombre.toLowerCase();
    if (lowerName.includes('admin')) return { icon: '🔐', color: '#E91E63' };
    if (lowerName.includes('super')) return { icon: '⚡', color: '#FF9800' };
    if (lowerName.includes('visitante')) return { icon: '👤', color: '#9E9E9E' };
    return { icon: '🛡️', color: '#114B5F' };
  };

  return (
    <SafeAreaView style={styles.contenedorPrincipal}>
      {/* HEADER COHERENTE CON EL RESTO DE LA APP */}
      <View style={styles.encabezadoBlanco}>
        <View>
          <Text style={styles.textoTitulo}>Roles</Text>
          <Text style={styles.subtituloTexto}>Niveles de acceso</Text>
        </View>
        <View style={styles.badgeContador}>
          <Text style={styles.textoContador}>{roles.length}</Text>
        </View>
      </View>

      <FlatList
        data={roles}
        keyExtractor={(item) => item.ID_Rol.toString()}
        renderItem={({ item }) => {
          const style = getRolStyle(item.Nombre_Rol);
          return (
            <View style={styles.tarjetaRol}>
              <View style={[styles.circuloIcono, { backgroundColor: style.color + '20' }]}>
                <Text style={styles.emojiIcono}>{style.icon}</Text>
              </View>
              
              <View style={styles.cuerpoInfo}>
                <View style={styles.filaHeader}>
                  <Text style={[styles.nombreRol, { color: style.color }]}>
                    {item.Nombre_Rol}
                  </Text>
                  <Text style={styles.idText}>ID: {item.ID_Rol}</Text>
                </View>
                
                <Text style={styles.descripcionRol} numberOfLines={2}>
                  {item.Descripcion || 'Este rol no tiene una descripción asignada aún.'}
                </Text>
              </View>
            </View>
          );
        }}
        contentContainerStyle={styles.listaPadding}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#114B5F']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay roles configurados</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedorPrincipal: { flex: 1, backgroundColor: '#C8DFEA' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
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
  },
  textoTitulo: { fontSize: 28, color: '#365563', fontFamily: "Ultra" },
  subtituloTexto: { fontSize: 14, color: '#777', marginTop: -5 },
  badgeContador: { backgroundColor: '#114B5F', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  textoContador: { color: '#FFF', fontWeight: 'bold' },

  listaPadding: { paddingHorizontal: 15, paddingBottom: 30 },
  
  tarjetaRol: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
  },
  circuloIcono: {
    width: 55,
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  emojiIcono: { fontSize: 24 },
  cuerpoInfo: { flex: 1 },
  filaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nombreRol: { fontSize: 17, fontWeight: '800' },
  idText: { fontSize: 10, color: '#AAA', fontWeight: 'bold' },
  descripcionRol: { fontSize: 13, color: '#666', marginTop: 3, lineHeight: 18 },

  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#365563', fontSize: 15, opacity: 0.5 },
});