import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import { accessService } from '../services/api';

export default function MisAccesos({ navigation }) {
  const [fontsLoaded] = useFonts({
    Ultra: require("../assets/fonts/DelaGothicOne-Regular.ttf"),
  });

  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [historial, setHistorial] = useState([]);

  const cargarHistorial = async () => {
  try {
    const userId = user?.ID_Usuario || user?.id;
    console.log('🟢 Cargando accesos para usuario ID:', userId);
    const result = await accessService.getUserAccess(userId);
    if (result.success) setHistorial(result.data);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  const onRefresh = () => {
    setRefreshing(true);
    cargarHistorial();
  };

  useEffect(() => {
    cargarHistorial();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#114B5F" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.contenedor}>
      {/* ENCABEZADO IGUAL QUE MisVehiculos */}
      <View style={styles.encabezadoBlanco}>
        <Text style={styles.textoTitulo}>Mis Accesos</Text>
        <TouchableOpacity style={styles.badgePerfil}>
          <Text style={styles.nombrePerfil}>ID: {user?.ID_Usuario || user?.id}</Text>
        </TouchableOpacity>
      </View>

      {/* CONTENIDO */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#114B5F" />
          <Text style={styles.loadingText}>Cargando historial...</Text>
        </View>
      ) : (
        <FlatList
          data={historial}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.lista}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#114B5F']} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="time-outline" size={60} color="#ABBCC4" />
              <Text style={styles.emptyText}>No hay registros de acceso</Text>
              <Text style={styles.emptySubtext}>Tus accesos aparecerán aquí</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.tarjeta}>
              <Fila label="FECHA" value={item.fecha} />
              <Fila label="HORA" value={item.hora} />
              <Fila label="TIPO" value={item.tipo} />
              <Fila label="LUGAR" value={item.lugar} />
              <View style={[styles.filaEstado, { backgroundColor: item.tipo === 'Entrada' ? '#4CAF50' : '#f44336' }]}>
                <Text style={styles.txtEstado}>
                  {item.tipo === 'Entrada' ? 'ACCESO AUTORIZADO' : 'ACCESO DENEGADO'}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const Fila = ({ label, value }) => (
  <View style={styles.fila}>
    <View style={styles.colEtiq}>
      <Text style={styles.txtEtiq}>{label}</Text>
    </View>
    <View style={styles.colVal}>
      <Text style={styles.txtVal}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#C8DFEA' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#C8DFEA' },
  loadingText: { marginTop: 10, color: '#365563', fontSize: 12 },

  // ENCABEZADO IGUAL QUE MisVehiculos
  encabezadoBlanco: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 15,
    margin: 15,
  },
  textoTitulo: { fontSize: 28, color: '#365563', fontFamily: "Ultra" },
  badgePerfil: { padding: 8, borderRadius: 10, borderWidth: 1, borderColor: '#365563' },
  nombrePerfil: { color: '#365563', fontSize: 12, fontWeight: 'bold' },

  // LISTA Y TARJETAS
  lista: { paddingHorizontal: 15, paddingBottom: 100 },
  tarjeta: {
    backgroundColor: '#C8DFEA',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FFF',
    elevation: 5,
  },
  fila: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#FFF',
  },
  colEtiq: {
    width: '35%',
    backgroundColor: '#365563',
    padding: 12,
  },
  txtEtiq: {
    color: '#FFF',
    fontSize: 10,
    fontFamily: "Ultra",
  },
  colVal: {
    width: '65%',
    padding: 12,
    backgroundColor: '#FFF',
  },
  txtVal: {
    color: '#365563',
    fontSize: 13,
    fontWeight: 'bold',
  },
  filaEstado: {
    padding: 10,
    alignItems: 'center',
  },
  txtEstado: {
    color: '#FFF',
    fontSize: 10,
    fontFamily: "Ultra",
    fontWeight: 'bold',
  },

  // EMPTY STATE
  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '500',
    color: '#365563',
  },
  emptySubtext: {
    marginTop: 5,
    fontSize: 12,
    color: '#999',
  },
});