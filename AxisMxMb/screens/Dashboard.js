import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFonts } from 'expo-font';


export default function Dashboard() {
  const [fontsLoaded] = useFonts({
    Ultra: require("../assets/fonts/DelaGothicOne-Regular.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.contenedor}>
      <ScrollView contentContainerStyle={styles.areaScroll} showsVerticalScrollIndicator={false}>
        
        {/* 1. Encabezado con Recuadro Blanco */}
        <View style={styles.encabezadoBlanco}>
          <Text style={styles.textoTitulo}>Dashboard</Text>
          <TouchableOpacity style={styles.badgePerfil}>
             <View style={styles.iconoPerfil} />
             <Text style={styles.nombrePerfil}>Cristobal</Text>
          </TouchableOpacity>
        </View>

        {/* 2. Cuadrícula de Estadísticas */}
        <View style={styles.cuadricula}>
          <View style={styles.cajaStat}>
            <Text style={styles.etiquetaStat}>Accesos vehiculares esta semana</Text>
            <Text style={styles.valorStat}>8</Text>
          </View>
          <View style={styles.cajaStat}>
            <Text style={styles.etiquetaStat}>Accesos peatonales esta semana</Text>
            <Text style={styles.valorStat}>14</Text>
          </View>
          <View style={styles.cajaStat}>
            <Text style={styles.etiquetaStat}>Total esta semana</Text>
            <Text style={styles.valorStat}>14</Text>
          </View>
          <View style={styles.cajaStat}>
            <Text style={styles.etiquetaStat}>Zona mas Trafico</Text>
            <Text style={[styles.valorStat, { fontSize: 16 }]}>Entrada Principal</Text>
          </View>
        </View>

        {/* 3. CONTENEDOR DE ACCESOS RECIENTES */}
        <View style={styles.contenedorAccesos}>
          <Text style={styles.tituloSeccion}>Accesos Recientes</Text>

          <TarjetaAcceso 
            datos={{
              fecha: "08/03/2023 12:45",
              usuario: "Cervantes Santana Cristobal Eduardo",
              zona: "Almacen",
              credencial: "124050867",
              tipo: "Placa",
              estado: "Activo"
            }} 
          />
          <TarjetaAcceso 
            datos={{
              fecha: "08/03/2023 12:45",
              usuario: "Cervantes Santana Cristobal Eduardo",
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
  textoTitulo: { fontSize: 25, color: '#365563', fontFamily: "Ultra" },
  badgePerfil: { flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 12, borderWidth: 1, borderColor: '#355563' },
  iconoPerfil: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: '#365563', marginRight: 6 },
  nombrePerfil: { color: '#365563', fontSize: 14 },

  // Stats
  cuadricula: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 5 },
  cajaStat: { width: '48%', backgroundColor: '#FFF', padding: 12, borderRadius: 12, marginBottom: 15, height: 100, justifyContent: 'space-between' },
  etiquetaStat: { fontSize: 11, color: '#608da2', fontFamily: "Ultra" },
  valorStat: { fontSize: 20, color: '#365563', fontFamily: "Ultra" },

  // CONTENEDOR BLANCO DE ACCESOS RECIENTES
  contenedorAccesos: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginTop: 5,
  },
  tituloSeccion: { fontSize: 20, color: '#365563', marginBottom: 15, fontFamily: "Ultra" },
  
  // Tablas internas
  tarjetaFila: { backgroundColor: '#C8DFEA', borderRadius: 8, overflow: 'hidden', marginBottom: 15, borderWidth: 2, borderColor: '#FFF' },
  fila: { flexDirection: 'row', borderBottomWidth: 3, borderBottomColor: '#FFF' },
  colEtiqueta: { width: '38%', backgroundColor: '#365563', padding: 10, justifyContent: 'center' },
  textoEtiqueta: { color: '#FFF', fontSize: 12, fontFamily: "Ultra" },
  colValor: { width: '62%', padding: 10, justifyContent: 'center' },
  textoValor: { color: '#365563', fontSize: 12, },

})