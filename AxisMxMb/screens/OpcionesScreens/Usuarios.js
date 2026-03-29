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
  Modal, // <--- Importamos Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { useFocusEffect } from '@react-navigation/native';
import { userService, rolService } from '../../services/api';

export default function Usuarios({ navigation }) {
  const [fontsLoaded] = useFonts({
    Ultra: require("../../assets/fonts/DelaGothicOne-Regular.ttf"),
  });

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  
  // Estados para el nuevo selector
  const [roles, setRoles] = useState([]);
  const [filtroRol, setFiltroRol] = useState(''); // Nombre del rol filtrado
  const [modalVisible, setModalVisible] = useState(false);

  const cargarUsuarios = async () => {
    const result = await userService.getAll();
    if (result.success) {
      setUsuarios(result.data);
    } else {
      Alert.alert('Error', result.message);
    }
    setLoading(false);
  };

  const cargarRoles = async () => {
    const result = await rolService.getAll();
    if (result.success) {
      setRoles(result.data);
    }
  };

  useEffect(() => {
    cargarRoles();
    cargarUsuarios();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      cargarUsuarios();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarUsuarios();
    setRefreshing(false);
  };

  // Lógica de filtrado
  const usuariosFiltrados = () => {
    let resultado = [...usuarios];
    
    if (busqueda.trim() !== '') {
      const busquedaLower = busqueda.toLowerCase();
      resultado = resultado.filter(u => 
        `${u.Nombre} ${u.Ap_Paterno}`.toLowerCase().includes(busquedaLower) ||
        (u.Email || '').toLowerCase().includes(busquedaLower) ||
        (u.Matricula || '').toLowerCase().includes(busquedaLower)
      );
    }
    
    if (filtroRol !== '') {
      resultado = resultado.filter(u => u.rol?.Nombre_Rol === filtroRol);
    }
    
    return resultado;
  };

  if (!fontsLoaded) return null;

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#114B5F" />
        <Text style={styles.loadingText}>Cargando usuarios...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.contenedor}>
      {/* HEADER */}
      <View style={styles.encabezadoBlanco}>
        <Text style={styles.textoTitulo}>Usuarios</Text>
        <TouchableOpacity style={styles.badgePerfil}>
          <View style={styles.iconoPerfil} />
          <Text style={styles.nombrePerfil}>Admin</Text>
        </TouchableOpacity>
      </View>

      {/* FILTROS */}
      <View style={styles.contenedorFiltros}>
        <TextInput 
          style={styles.inputBusqueda} 
          placeholder="Buscar por nombre o matrícula..." 
          placeholderTextColor="#365563"
          value={busqueda}
          onChangeText={setBusqueda}
        />
        
        <View style={styles.filaFiltros}>
          {/* BOTÓN QUE ACTIVA EL MODAL (REEMPLAZA AL PICKER) */}
          <TouchableOpacity 
            style={styles.selectorFiltro} 
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.textoSelector} numberOfLines={1}>
              {filtroRol === '' ? 'Todos los roles' : filtroRol}
            </Text>
            <Text style={styles.flecha}>▼</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botonAgregar} onPress={() => navigation.navigate('CrearUsuario')}>
            <Text style={styles.textoAgregar}>+ Agregar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* LISTADO */}
      <FlatList
        data={usuariosFiltrados()}
        keyExtractor={(item) => item.ID_Usuario.toString()}
        renderItem={({ item }) => (
          <TarjetaUsuario 
            datos={{
              id: item.ID_Usuario,
              usuario: `${item.Nombre} ${item.Ap_Paterno}`,
              rol: item.rol?.Nombre_Rol || 'Sin rol',
              matricula: item.Matricula || 'N/A',
              email: item.Email,
              estado: Number(item.ID_Estado) === 1 ? 'Activo' : 'Inactivo',
            }} 
            onEdit={() => navigation.navigate('EditarUsuario', { usuario: item })}
            // ... resto de tus funciones handleEliminar, etc ...
          />
        )}
        contentContainerStyle={styles.contenedorLista}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />

      {/* MODAL SELECTOR DE ROL (FILTRO) */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Filtrar por Rol</Text>
            
            <TouchableOpacity 
              style={styles.opcionRol} 
              onPress={() => { setFiltroRol(''); setModalVisible(false); }}
            >
              <Text style={[styles.opcionTxt, filtroRol === '' && styles.opcionActiva]}>Ver Todos</Text>
            </TouchableOpacity>

            <FlatList
              data={roles}
              keyExtractor={(item) => item.ID_Rol.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.opcionRol} 
                  onPress={() => { setFiltroRol(item.Nombre_Rol); setModalVisible(false); }}
                >
                  <Text style={[styles.opcionTxt, filtroRol === item.Nombre_Rol && styles.opcionActiva]}>
                    {item.Nombre_Rol}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity style={styles.botonCerrarModal} onPress={() => setModalVisible(false)}>
              <Text style={styles.textoCerrar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Componente TarjetaUsuario (Igual al tuyo, con tus estilos)
const TarjetaUsuario = ({ datos, onEdit }) => (
  <View style={styles.tarjetaFila}>
    <Fila label="ID" value={datos.id.toString()} />
    <Fila label="Usuario" value={datos.usuario} />
    <Fila label="Rol" value={datos.rol} />
    <Fila label="Estado" value={datos.estado} />
    <View style={styles.filaAcciones}>
      <View style={styles.colEtiquetaAccion}><Text style={styles.textoEtiqueta}>Acciones</Text></View>
      <View style={styles.colValorAccion}>
        <TouchableOpacity style={styles.botonEditar} onPress={onEdit}>
          <Text style={styles.textoBotonAccion}>Editar</Text>
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
  // ... TUS ESTILOS ORIGINALES ...
  contenedor: { flex: 1, backgroundColor: '#C8DFEA' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#C8DFEA' },
  loadingText: { marginTop: 10, color: '#365563' },
  encabezadoBlanco: { backgroundColor: '#FFF', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderRadius: 15, marginHorizontal: 15, marginTop: 15 },
  textoTitulo: { fontSize: 32, color: '#365563', fontFamily: "Ultra" },
  badgePerfil: { flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 12, borderWidth: 1, borderColor: '#365563' },
  iconoPerfil: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: '#365563', marginRight: 6 },
  nombrePerfil: { color: '#365563', fontSize: 14 },
  contenedorFiltros: { backgroundColor: '#FFF', borderRadius: 15, padding: 15, marginHorizontal: 15, marginVertical: 15 },
  inputBusqueda: { backgroundColor: '#C8DFEA', borderRadius: 10, paddingHorizontal: 15, paddingVertical: 10, color: '#365563', marginBottom: 12, borderWidth: 1, borderColor: '#365563' },
  filaFiltros: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  
  // NUEVO ESTILO PARA EL SELECTOR (MODAL TRIGGER)
  selectorFiltro: {
    backgroundColor: '#C8DFEA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#365563',
    width: '55%', // Un poco más ancho para que quepa el texto
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  textoSelector: { color: '#365563', fontSize: 12, fontWeight: '600' },
  flecha: { color: '#365563', fontSize: 10 },

  botonAgregar: { backgroundColor: '#C8DFEA', paddingHorizontal: 15, height: 40, borderRadius: 8, borderWidth: 1, borderColor: '#365563', justifyContent: 'center' },
  textoAgregar: { color: '#365563', fontSize: 12 },

  // ESTILOS DEL MODAL
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFF', width: '80%', borderRadius: 20, padding: 20, elevation: 5 },
  modalHeader: { fontSize: 18, fontWeight: 'bold', color: '#114B5F', marginBottom: 15, textAlign: 'center' },
  opcionRol: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  opcionTxt: { fontSize: 16, color: '#666', textAlign: 'center' },
  opcionActiva: { color: '#114B5F', fontWeight: 'bold' },
  botonCerrarModal: { marginTop: 15, padding: 10 },
  textoCerrar: { color: '#FF0000', textAlign: 'center', fontWeight: 'bold' },

  // TARJETAS Y FILAS (TUS ESTILOS)
  contenedorLista: { paddingHorizontal: 15, paddingBottom: 20 },
  tarjetaFila: { backgroundColor: '#C8DFEA', borderRadius: 8, overflow: 'hidden', marginBottom: 15, borderWidth: 2, borderColor: '#FFF' },
  fila: { flexDirection: 'row', borderBottomWidth: 3, borderBottomColor: '#FFF' },
  colEtiqueta: { width: '30%', backgroundColor: '#365563', padding: 10 },
  textoEtiqueta: { color: '#FFF', fontSize: 12, fontFamily: "Ultra" },
  colValor: { width: '70%', padding: 10 },
  textoValor: { color: '#365563', fontSize: 12 },
  filaAcciones: { flexDirection: 'row' },
  colEtiquetaAccion: { width: '30%', backgroundColor: '#365563', padding: 10 },
  colValorAccion: { width: '70%', padding: 10, flexDirection: 'row', justifyContent: 'center' },
  botonEditar: { backgroundColor: '#114B5F', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 15 },
  textoBotonAccion: { fontSize: 12, fontWeight: 'bold', color: '#fff' },
});