import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';

export default function MetodosAcceso() {
  const [fontsLoaded] = useFonts({
    Ultra: require("../../assets/fonts/DelaGothicOne-Regular.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.contenedor}>
      <ScrollView contentContainerStyle={styles.areaScroll} showsVerticalScrollIndicator={false}>
        
        {/* 1. Encabezado */}
        <View style={styles.encabezadoBlanco}>
          <Text style={styles.textoTitulo}>Métodos{"\n"}Acceso</Text>
          <TouchableOpacity style={styles.badgePerfil}>
             <View style={styles.iconoPerfil} />
             <Text style={styles.nombrePerfil}>Cristobal</Text>
          </TouchableOpacity>
        </View>

        {/* 2. Filtros y Búsqueda */}
        <View style={styles.contenedorFiltros}>
          <TextInput 
            style={styles.inputBusqueda} 
            placeholder="Buscar usuario o tag" 
            placeholderTextColor="#365563"
          />
          
          <View style={styles.filaFiltros}>
            <TouchableOpacity style={styles.selectorFiltro}>
              <Text style={styles.textoFiltro}>Estatus</Text>
              <View style={styles.trianguloFlecha} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.botonAgregar}>
              <Text style={styles.textoAgregar}>+ Agregar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. Lista de Métodos */}
        <View style={styles.contenedorLista}>
          <TarjetaMetodo 
            datos={{
              id: "8",
              usuario: "Cervantes Santana Cristobal Eduardo",
              tag: "A-00125",
              descripcion: "Targeta Principal",
              estado: "Activo"
            }} 
          />
          <TarjetaMetodo 
            datos={{
              id: "9",
              usuario: "Hernandez Maldonado Aldo Uriel",
              tag: "Q-00205",
              descripcion: "Acceso laboratorio",
              estado: "Inactivo"
            }} 
          />
          <TarjetaMetodo 
            datos={{
              id: "10",
              usuario: "Jimenez Perez Valentina",
              tag: "ABC-123",
              descripcion: "Acceso vehicular",
              estado: "Activo"
            }} 
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const TarjetaMetodo = ({ datos }) => (
  <View style={styles.tarjetaFila}>
    <Fila label="ID" value={datos.id} />
    <Fila label="Usuario" value={datos.usuario} />
    <Fila label="Tag" value={datos.tag} />
    <Fila label="Descripcion" value={datos.descripcion} />
    <Fila label="Estado" value={datos.estado} />
    
    <View style={styles.filaAcciones}>
      <View style={styles.colEtiquetaAccion}>
        <Text style={styles.textoEtiqueta}>Acciones</Text>
      </View>
      <View style={styles.colValorAccion}>
        <TouchableOpacity style={styles.botonEditar}>
          <Text style={styles.textoBotonAccion}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botonBorrar}>
          <Text style={[styles.textoBotonAccion]}>Borrar</Text>
        </TouchableOpacity>
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
  textoTitulo: { fontSize: 28, color: '#365563', fontFamily: "Ultra", lineHeight: 32 },
  badgePerfil: { flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 12, borderWidth: 1, borderColor: '#365563' },
  iconoPerfil: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: '#365563', marginRight: 6 },
  nombrePerfil: { color: '#365563', fontSize: 14 },

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
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 8,
    width: '45%',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#365563',
  },
  textoFiltro: { color: '#365563', fontSize: 12 },
  trianguloFlecha: {
    width: 0, height: 0,
    borderLeftWidth: 5, borderRightWidth: 5, borderTopWidth: 8,
    borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#365563',
  },
  botonAgregar: {
    backgroundColor: '#C8DFEA',
    paddingHorizontal: 15,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#365563',
    justifyContent: 'center',
  },
  textoAgregar: { color: '#365563', fontSize: 12 },

  contenedorLista: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
  },
  tarjetaFila: { backgroundColor: '#C8DFEA', borderRadius: 8, overflow: 'hidden', marginBottom: 15, borderWidth: 2, borderColor: '#FFF' },
  fila: { flexDirection: 'row', borderBottomWidth: 3, borderBottomColor: '#FFF' },
  colEtiqueta: { width: '32%', backgroundColor: '#365563', padding: 10, justifyContent: 'center' },
  textoEtiqueta: { color: '#FFF', fontSize: 11, fontFamily: "Ultra" },
  colValor: { width: '68%', padding: 10, justifyContent: 'center' },
  textoValor: { color: '#365563', fontSize: 12 },

  filaAcciones: { flexDirection: 'row' },
  colEtiquetaAccion: { width: '32%', backgroundColor: '#365563', padding: 10, justifyContent: 'center' },
  colValorAccion: { width: '68%', padding: 10, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  botonEditar: { backgroundColor: '#FFF', paddingVertical: 5, paddingHorizontal: 15, borderRadius: 15 },
  botonBorrar: { backgroundColor: '#FF0000', paddingVertical: 5, paddingHorizontal: 15, borderRadius: 15 },
  textoBotonAccion: { fontSize: 11, color: '#000' },

});