import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { vehicleService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function MisVehiculos({ navigation }) {
  const { user } = useAuth();
  const [vehiculos, setVehiculos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [fontsLoaded] = useFonts({ Ultra: require("../assets/fonts/DelaGothicOne-Regular.ttf") });

  const cargarVehiculos = async () => {
    // Usar user?.ID_Usuario o user?.id, cualquiera que funcione
    const userId = user?.ID_Usuario || user?.id;
    console.log('🟢 Cargando vehículos para usuario ID:', userId);
    
    if (!userId) {
      console.log('❌ No hay ID de usuario');
      return;
    }
    
    const res = await vehicleService.getByUser(userId);
    console.log('🟢 Respuesta vehículos:', res);
    
    if (res.success) {
      setVehiculos(res.data);
    } else {
      console.log('❌ Error:', res.message);
    }
  };

  useFocusEffect(
    React.useCallback(() => { 
      cargarVehiculos(); 
    }, [user]) // Dependencia en user
  );

  const handleEliminar = async (id) => {
    Alert.alert('Eliminar', '¿Deseas dar de baja este vehículo?', [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Eliminar', 
        style: 'destructive', 
        onPress: async () => {
          const result = await vehicleService.delete(id);
          if (result.success) {
            Alert.alert('Éxito', 'Vehículo eliminado');
            cargarVehiculos();
          } else {
            Alert.alert('Error', result.message);
          }
        }
      }
    ]);
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.contenedor}>
      <View style={styles.encabezadoBlanco}>
        <Text style={styles.textoTitulo}>Mis Autos</Text>
        <TouchableOpacity style={styles.badgePerfil}>
          <Text style={styles.nombrePerfil}>ID: {user?.ID_Usuario || user?.id}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={vehiculos}
        keyExtractor={(item) => item.ID_Vehiculo.toString()}
        contentContainerStyle={styles.lista}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={cargarVehiculos} />}
        renderItem={({ item }) => (
          <View style={styles.tarjeta}>
            <Fila label="PLACA" value={item.Placa} />
            <Fila label="MARCA" value={item.modelo?.marca?.Nombre_Marca} />
            <Fila label="MODELO" value={item.modelo?.Nombre_Modelo} />
            <TouchableOpacity style={styles.btnTrash} onPress={() => handleEliminar(item.ID_Vehiculo)}>
              <Icon name="trash-outline" size={20} color="#FFF" />
              <Text style={styles.txtTrash}>ELIMINAR REGISTRO</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {vehiculos.length < 2 && (
        <TouchableOpacity 
          style={styles.fab} 
          onPress={() => navigation.navigate('AgregarVehiculo')}
        >
          <Icon name="add" size={35} color="#FFF" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const Fila = ({ label, value }) => (
  <View style={styles.fila}>
    <View style={styles.colEtiq}><Text style={styles.txtEtiq}>{label}</Text></View>
    <View style={styles.colVal}><Text style={styles.txtVal}>{value}</Text></View>
  </View>
);

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#C8DFEA' },
  encabezadoBlanco: { backgroundColor: '#FFF', flexDirection: 'row', justifyContent: 'space-between', padding: 18, borderRadius: 15, margin: 15, alignItems: 'center' },
  textoTitulo: { fontSize: 28, color: '#365563', fontFamily: "Ultra" },
  badgePerfil: { padding: 8, borderRadius: 10, borderWidth: 1, borderColor: '#365563' },
  nombrePerfil: { color: '#365563', fontSize: 12, fontWeight: 'bold' },
  lista: { paddingHorizontal: 15, paddingBottom: 100 },
  tarjeta: { backgroundColor: '#C8DFEA', borderRadius: 10, overflow: 'hidden', marginBottom: 20, borderWidth: 2, borderColor: '#FFF', elevation: 5 },
  fila: { flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: '#FFF' },
  colEtiq: { width: '35%', backgroundColor: '#365563', padding: 12 },
  txtEtiq: { color: '#FFF', fontSize: 10, fontFamily: "Ultra" },
  colVal: { width: '65%', padding: 12, backgroundColor: '#FFF' },
  txtVal: { color: '#365563', fontSize: 13, fontWeight: 'bold' },
  btnTrash: { backgroundColor: '#FF5252', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 10 },
  txtTrash: { color: '#FFF', fontFamily: 'Ultra', fontSize: 10, marginLeft: 8 },
  fab: { position: 'absolute', bottom: 30, right: 30, backgroundColor: '#365563', width: 65, height: 65, borderRadius: 33, justifyContent: 'center', alignItems: 'center', elevation: 10 }
});