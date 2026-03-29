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
import { vehicleService } from '../../services/api';

export default function Vehiculos({ navigation }) {
  const [fontsLoaded] = useFonts({
    Ultra: require("../../assets/fonts/DelaGothicOne-Regular.ttf"),
  });

  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const cargarVehiculos = async () => {
    const result = await vehicleService.getAll();
    if (result.success) {
      setVehiculos(result.data);
    } else {
      Alert.alert('Error', result.message);
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarVehiculos();
    setRefreshing(false);
  };

  // Recargar cuando la pantalla recibe foco
  useFocusEffect(
    React.useCallback(() => {
      cargarVehiculos();
    }, [])
  );

  const vehiculosFiltrados = () => {
    if (busqueda === '') return vehiculos;
    
    return vehiculos.filter(vehiculo => {
      const placa = vehiculo.Placa?.toLowerCase() || '';
      const marcaModelo = `${vehiculo.modelo?.marca?.Nombre_Marca || ''} ${vehiculo.modelo?.Nombre_Modelo || ''}`.toLowerCase();
      const propietario = vehiculo.propietario_actual?.Nombre?.toLowerCase() || '';
      const busquedaLower = busqueda.toLowerCase();
      
      return placa.includes(busquedaLower) || 
             marcaModelo.includes(busquedaLower) ||
             propietario.includes(busquedaLower);
    });
  };

  if (!fontsLoaded) return null;

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#114B5F" />
        <Text style={styles.loadingText}>Cargando vehículos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.contenedor}>
      {/* Encabezado */}
      <View style={styles.encabezadoBlanco}>
        <Text style={styles.textoTitulo}>Vehículos</Text>
        <TouchableOpacity style={styles.badgePerfil}>
          <View style={styles.iconoPerfil} />
          <Text style={styles.nombrePerfil}>Admin</Text>
        </TouchableOpacity>
      </View>

      {/* Búsqueda */}
      <View style={styles.contenedorFiltros}>
        <TextInput 
          style={styles.inputBusqueda} 
          placeholder="Buscar por placa, marca o propietario" 
          placeholderTextColor="#365563"
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      {/* Lista de vehículos */}
      <FlatList
        data={vehiculosFiltrados()}
        keyExtractor={(item) => item.ID_Vehiculo.toString()}
        renderItem={({ item }) => (
          <TarjetaVehiculo 
            datos={{
              id: item.ID_Vehiculo,
              placa: item.Placa || 'N/A',
              marcaModelo: `${item.modelo?.marca?.Nombre_Marca || 'Sin marca'} ${item.modelo?.Nombre_Modelo || ''}`,
              anio: item.Anio || 'N/A',
              color: item.Color || 'N/A',
              estado: item.ID_Estado === 1 ? 'Activo' : 'Inactivo',
              propietario: item.propietario_actual?.Nombre 
                ? `${item.propietario_actual.Nombre} ${item.propietario_actual.Ap_Paterno || ''}`
                : 'Sin propietario asignado'
            }} 
          />
        )}
        contentContainerStyle={styles.contenedorLista}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#114B5F']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay vehículos registrados</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const TarjetaVehiculo = ({ datos }) => (
  <View style={styles.tarjetaFila}>
    <Fila label="ID" value={datos.id.toString()} />
    <Fila label="Placa" value={datos.placa} />
    <Fila label="Marca/Modelo" value={datos.marcaModelo} />
    <Fila label="Año" value={datos.anio} />
    <Fila label="Color" value={datos.color} />
    <Fila label="Propietario" value={datos.propietario} />
    <Fila label="Estado" value={datos.estado} />
  </View>
);

const Fila = ({ label, value }) => (
  <View style={styles.fila}>
    <View style={styles.colEtiqueta}>
      <Text style={styles.textoEtiqueta}>{label}</Text>
    </View>
    <View style={styles.colValor}>
      <Text style={styles.textoValor}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#C8DFEA' },
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#C8DFEA',
  },
  loadingText: {
    marginTop: 10,
    color: '#365563',
    fontSize: 14,
  },
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
  },
  textoTitulo: { fontSize: 32, color: '#365563', fontFamily: "Ultra" },
  badgePerfil: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 8, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#365563' 
  },
  iconoPerfil: { 
    width: 20, 
    height: 20, 
    borderRadius: 10, 
    borderWidth: 1.5, 
    borderColor: '#365563', 
    marginRight: 6 
  },
  nombrePerfil: { color: '#365563', fontSize: 14 },

  contenedorFiltros: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 15,
  },
  inputBusqueda: {
    backgroundColor: '#C8DFEA',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: '#365563',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#365563',
  },

  contenedorLista: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  tarjetaFila: { 
    backgroundColor: '#C8DFEA', 
    borderRadius: 8, 
    overflow: 'hidden', 
    marginBottom: 15, 
    borderWidth: 2, 
    borderColor: '#FFF' 
  },
  fila: { 
    flexDirection: 'row', 
    borderBottomWidth: 3, 
    borderBottomColor: '#FFF' 
  },
  colEtiqueta: { 
    width: '30%', 
    backgroundColor: '#365563', 
    padding: 10, 
    justifyContent: 'center' 
  },
  textoEtiqueta: { 
    color: '#FFF', 
    fontSize: 12, 
    fontFamily: "Ultra" 
  },
  colValor: { 
    width: '70%', 
    padding: 10, 
    justifyContent: 'center' 
  },
  textoValor: { 
    color: '#365563', 
    fontSize: 12 
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#365563',
    fontSize: 14,
  },
});