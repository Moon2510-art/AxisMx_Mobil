import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { useFocusEffect } from '@react-navigation/native';
import { accessService } from '../../services/api'; // Importamos tu nuevo servicio

export default function RegistrosAcceso() {
  const [fontsLoaded] = useFonts({
    Ultra: require("../../assets/fonts/DelaGothicOne-Regular.ttf"),
  });

  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const cargarRegistros = async () => {
    const result = await accessService.getAll();
    if (result.success) {
      setRegistros(result.data);
    } else {
      Alert.alert('Error', result.message);
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarRegistros();
    setRefreshing(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      cargarRegistros();
    }, [])
  );

  const registrosFiltrados = () => {
    if (!busqueda.trim()) return registros;
    const lowerBusqueda = busqueda.toLowerCase();
    return registros.filter(reg => 
      reg.usuario?.toLowerCase().includes(lowerBusqueda) || 
      reg.credencial?.toLowerCase().includes(lowerBusqueda) ||
      reg.zona?.toLowerCase().includes(lowerBusqueda)
    );
  };

  if (!fontsLoaded) return null;

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#114B5F" />
        <Text style={styles.loadingText}>Cargando bitácora...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.contenedor}>
      {/* Encabezado idéntico al de Usuarios */}
      <View style={styles.encabezadoBlanco}>
        <Text style={styles.textoTitulo}>Accesos</Text>
        <TouchableOpacity style={styles.badgePerfil}>
          <View style={styles.iconoPerfil} />
          <Text style={styles.nombrePerfil}>Seguridad</Text>
        </TouchableOpacity>
      </View>

      {/* Buscador idéntico al de Usuarios */}
      <View style={styles.contenedorFiltros}>
        <TextInput 
          style={styles.inputBusqueda} 
          placeholder="Buscar por usuario, zona o ID..." 
          placeholderTextColor="#365563"
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      <FlatList
        data={registrosFiltrados()}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TarjetaAcceso 
            datos={{
              fecha: item.fecha_hora, // Ajusta según los nombres de tu BD
              usuario: item.Nombre_Completo || 'Desconocido',
              zona: item.Zona_Acceso || 'General',
              credencial: item.ID_Credencial || item.Placa,
              tipo: item.Tipo_Acceso,
              estado: item.Estatus_Acceso // Ej: 'Autorizado' o 'Denegado'
            }} 
          />
        )}
        contentContainerStyle={styles.contenedorLista}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#114B5F']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay registros el día de hoy</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const TarjetaAcceso = ({ datos }) => (
  <View style={styles.tarjetaFila}>
    <Fila label="Fecha/Hora" value={datos.fecha} />
    <Fila label="Usuario" value={datos.usuario} />
    <Fila label="Ubicación" value={datos.zona} />
    <Fila label="ID/Placa" value={datos.credencial} />
    <Fila label="Tipo" value={datos.tipo} />
    <View style={styles.fila}>
      <View style={styles.colEtiqueta}>
        <Text style={styles.textoEtiqueta}>Estado</Text>
      </View>
      <View style={[
        styles.colValor, 
        { backgroundColor: datos.estado === 'Autorizado' ? '#D4EDDA' : '#F8D7DA' }
      ]}>
        <Text style={[
          styles.textoValor, 
          { color: datos.estado === 'Autorizado' ? '#155724' : '#721C24', fontWeight: 'bold' }
        ]}>
          {datos.estado}
        </Text>
      </View>
    </View>
  </View>
);

const Fila = ({ label, value }) => (
  <View style={styles.fila}>
    <View style={styles.colEtiqueta}><Text style={styles.textoEtiqueta}>{label}</Text></View>
    <View style={styles.colValor}><Text style={styles.textoValor}>{value}</Text></View>
  </View>
);

const styles = StyleSheet.create({
  // Se mantienen tus estilos para conservar la estética industrial
  contenedor: { flex: 1, backgroundColor: '#C8DFEA' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#C8DFEA' },
  loadingText: { marginTop: 10, color: '#365563', fontSize: 14 },
  encabezadoBlanco: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 15,
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#365563'
  },
  textoTitulo: { fontSize: 32, color: '#365563', fontFamily: "Ultra" },
  badgePerfil: { flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 12, borderWidth: 1, borderColor: '#365563' },
  iconoPerfil: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: '#365563', marginRight: 6 },
  nombrePerfil: { color: '#365563', fontSize: 14 },
  contenedorFiltros: { backgroundColor: '#FFF', borderRadius: 15, padding: 15, marginHorizontal: 15, marginBottom: 15, borderWidth: 1, borderColor: '#365563' },
  inputBusqueda: { backgroundColor: '#C8DFEA', borderRadius: 10, paddingHorizontal: 15, paddingVertical: 10, color: '#365563', borderWidth: 1, borderColor: '#365563' },
  contenedorLista: { paddingHorizontal: 15, paddingBottom: 20 },
  tarjetaFila: { backgroundColor: '#C8DFEA', borderRadius: 8, overflow: 'hidden', marginBottom: 15, borderWidth: 2, borderColor: '#FFF' },
  fila: { flexDirection: 'row', borderBottomWidth: 3, borderBottomColor: '#FFF' },
  colEtiqueta: { width: '35%', backgroundColor: '#365563', padding: 10, justifyContent: 'center' },
  textoEtiqueta: { color: '#FFF', fontSize: 11, fontFamily: "Ultra" },
  colValor: { width: '65%', padding: 10, justifyContent: 'center' },
  textoValor: { color: '#365563', fontSize: 12 },
  emptyContainer: { alignItems: 'center', padding: 40 },
  emptyText: { color: '#365563', fontSize: 14, fontFamily: 'Ultra' },
});