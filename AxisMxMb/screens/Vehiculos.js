import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';

export default function Vehiculos() {
  const [fontsLoaded] = useFonts({
    Ultra: require("../assets/fonts/DelaGothicOne-Regular.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.contenedor}>
      <ScrollView contentContainerStyle={styles.areaScroll} showsVerticalScrollIndicator={false}>
        
        {/* 1. Encabezado */}
        <View style={styles.encabezadoBlanco}>
          <Text style={styles.textoTitulo}>Vehiculos</Text>
          <TouchableOpacity style={styles.badgePerfil}>
             <View style={styles.iconoPerfil} />
             <Text style={styles.nombrePerfil}>Cristobal</Text>
          </TouchableOpacity>
        </View>

        {/* 2. Filtros y Búsqueda */}
        <View style={styles.contenedorFiltros}>
          <View style={styles.filaFiltros}>
            <Text style={styles.tituloSeccion}>Registro{'\n'}Vehicular</Text>
            <TouchableOpacity style={styles.botonAgregar}>
              <Text style={styles.textoAgregar}>+ Agregar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. Lista de Vehículos */}
        <View style={styles.contenedorLista}>
          <TarjetaVehiculo 
            datos={{
              id: "1",
              modelo: "Toyota Corolla",
              placa: "ABC-123",
              propietario: "Juan Garcia",
              descripcion: "Vehiculo Personal",
              estado: "Activo"
            }} 
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const TarjetaVehiculo = ({ datos }) => (
  <View style={styles.tarjetaFila}>
    <Fila label="Modelo" value={datos.modelo} />
    <Fila label="Placa" value={datos.placa} />
    <Fila label="Propietario" value={datos.propietario} />
    <Fila label="Descripcion" value={datos.descripcion} />
    <Fila label="Estado" value={datos.estado} />
  </View>
);

const Fila = ({ label, value }) => (
  <View style={styles.fila}>
    <View style={styles.colEtiqueta}><Text style={styles.textoEtiqueta}>{label}</Text></View>
    <View style={styles.colValor}><Text style={styles.textoValor}>{value}</Text></View>
  </View>
);

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#C8DFEA' },
  areaScroll: { paddingHorizontal: 15, paddingTop: 15, paddingBottom: 110 },
  
  encabezadoBlanco: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 15,
    marginBottom: 15,
  },
  textoTitulo: { fontSize: 32, color: '#365563', fontFamily: "Ultra" },
  badgePerfil: { flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 12, borderWidth: 1, borderColor: '#365563' },
  iconoPerfil: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: '#365563', marginRight: 6 },
  nombrePerfil: { color: '#365563', fontSize: 14 },

  contenedorFiltros: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  filaFiltros: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tituloSeccion: { fontSize: 20, color: '#365563', marginBottom: 15, fontFamily: "Ultra" },
  botonAgregar: {
    backgroundColor: '#C8DFEA',
    paddingHorizontal: 15,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#365563',
    justifyContent: 'center',
  },
  textoAgregar: { 
    color: '#365563', 
    fontSize: 12 
  },
  contenedorLista: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
  },
  tarjetaFila: { backgroundColor: '#C8DFEA', borderRadius: 8, overflow: 'hidden', marginBottom: 15, borderWidth: 2, borderColor: '#FFF' },
  fila: { flexDirection: 'row', borderBottomWidth: 3, borderBottomColor: '#FFF' },
  colEtiqueta: { width: '35%', backgroundColor: '#365563', padding: 10, justifyContent: 'center' },
  textoEtiqueta: { color: '#FFF', fontSize: 11, fontFamily: "Ultra" },
  colValor: { width: '65%', padding: 10, justifyContent: 'center' },
  textoValor: { color: '#365563', fontSize: 12 },
});