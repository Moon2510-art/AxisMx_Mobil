import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';

export default function RegistrosAcceso() {
  const [fontsLoaded] = useFonts({
     Ultra: require("../../assets/fonts/DelaGothicOne-Regular.ttf"),
  });
  
  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.contenedor}>
      <ScrollView contentContainerStyle={styles.areaScroll} showsVerticalScrollIndicator={false}>
        
        {/* 1. Encabezado con Título Dinámico */}
        <View style={styles.encabezadoBlanco}>
          <Text style={styles.textoTitulo}>Registros de{"\n"}Acceso</Text>
          <TouchableOpacity style={styles.badgePerfil}>
             <View style={styles.iconoPerfil} />
             <Text style={styles.nombrePerfil}>Cristobal</Text>
          </TouchableOpacity>
        </View>

        {/* 2. Sección de Filtros y Búsqueda */}
        <View style={styles.contenedorFiltros}>
          <TextInput 
            style={styles.inputBusqueda} 
            placeholder="Buscar usuario" 
            placeholderTextColor="#5b8799"
          />
          
          <View style={styles.filaFiltros}>
            <TouchableOpacity style={styles.selectorFiltro}>
              <Text style={styles.textoFiltro}>Estado</Text>
              <View style={styles.trianguloFlecha} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.selectorFiltro}>
              <Text style={styles.textoFiltro}>Tipo</Text>
              <View style={styles.trianguloFlecha} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.botonAgregar}>
              <Text style={styles.textoAgregar}>+ Agregar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. Contenedor de Lista de Resultados */}
        <View style={styles.contenedorLista}>
          <TarjetaAcceso 
            datos={{
              fecha: "08/03/2023 12:45",
              usuario: "Cervantes Santana cristobal Eduardo",
              zona: "Almacen",
              credencial: "124050867",
              tipo: "Placa",
              estado: "Activo"
            }} 
          />
          <TarjetaAcceso 
            datos={{
              fecha: "08/03/2023 12:45",
              usuario: "Cervantes Santana cristobal Eduardo",
              zona: "Almacen",
              credencial: "124050867",
              tipo: "Placa",
              estado: "Activo"
            }} 
          />
        </View>

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
    <Fila label="Estado" value={datos.estado} esUltimo />
  </View>
);

const Fila = ({ label, value, esUltimo }) => (
  <View style={[styles.fila, esUltimo && { borderBottomWidth: 0 }]}>
    <View style={styles.colEtiqueta}><Text style={styles.textoEtiqueta}>{label}</Text></View>
    <View style={styles.colValor}><Text style={styles.textoValor}>{value}</Text></View>
  </View>
);

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
  textoTitulo: { fontSize: 26, color: '#365563', lineHeight: 30, fontFamily: "Ultra" },
  badgePerfil: { flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 12, borderWidth: 1, borderColor: '#365563' },
  iconoPerfil: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: '#365563', marginRight: 6 },
  nombrePerfil: { color: '#365563', fontSize: 14 },

  // Filtros
  contenedorFiltros: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
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
  filaFiltros: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorFiltro: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C8DFEA',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    width: '30%',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#365563',
  },
  textoFiltro: { color: '#365563', fontSize: 12 },
  trianguloFlecha: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#365563',
  },
  botonAgregar: {
    backgroundColor: '#C8DFEA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#365563',
  },
  textoAgregar: { color: '#365563', fontSize: 12},

  // Lista
  contenedorLista: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
  },
  tarjetaFila: { backgroundColor: '#C8DFEA', borderRadius: 8, overflow: 'hidden', marginBottom: 15, borderWidth: 2, borderColor: '#FFF' },
  fila: { flexDirection: 'row', borderBottomWidth: 3, borderBottomColor: '#FFF' },
  colEtiqueta: { width: '38%', backgroundColor: '#365563', padding: 10, justifyContent: 'center' },
  textoEtiqueta: { color: '#FFF', fontSize: 12, fontFamily: "Ultra" },
  colValor: { width: '62%', padding: 10, justifyContent: 'center',  },
  textoValor: { color: '#365563', fontSize: 12 },

})