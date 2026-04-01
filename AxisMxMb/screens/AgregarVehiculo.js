import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/Ionicons';
import { vehicleService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AgregarVehiculo({ navigation }) {
  const { user } = useAuth();
  
  const [fontsLoaded] = useFonts({
    Ultra: require("../assets/fonts/DelaGothicOne-Regular.ttf"),
  });

  const [loading, setLoading] = useState(false);
  const [cargandoCatalogos, setCargandoCatalogos] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMarcasVisible, setModalMarcasVisible] = useState(false);
  const [modalModelosVisible, setModalModelosVisible] = useState(false);

  const [marcas, setMarcas] = useState([]);
  const [todosModelos, setTodosModelos] = useState([]);
  const [modelosFiltrados, setModelosFiltrados] = useState([]);

  const [formData, setFormData] = useState({
    Placa: '',
    ID_Modelo: '',
    Nombre_Marca: 'Seleccionar Marca...',
    Nombre_Modelo: 'Seleccionar Modelo...',
    Anio: '',
    Color: ''
  });

  useEffect(() => {
    cargarCatalogos();
  }, []);

  const cargarCatalogos = async () => {
  try {
    console.log('🔵 Cargando marcas...');
    const resM = await vehicleService.getMarcas();
    console.log('🔵 Marcas respuesta:', JSON.stringify(resM, null, 2));
    
    console.log('🟢 Cargando modelos...');
    const resMod = await vehicleService.getModelos();
    console.log('🟢 Modelos respuesta:', JSON.stringify(resMod, null, 2));
    
    if (resM.success) {
      console.log('✅ Marcas cargadas:', resM.data.length);
      setMarcas(resM.data);
    } else {
      console.log('❌ Error en marcas:', resM.message);
    }
    
    if (resMod.success) {
      console.log('✅ Modelos cargados:', resMod.data.length);
      setTodosModelos(resMod.data);
    } else {
      console.log('❌ Error en modelos:', resMod.message);
    }
  } catch (error) {
    console.error('🔴 Error en cargarCatalogos:', error);
    Alert.alert("Error", "No se pudieron cargar los catálogos: " + error.message);
  } finally {
    setCargandoCatalogos(false);
  }
};

  const seleccionarMarca = (marca) => {
    const filtrados = todosModelos.filter(m => m.ID_Marca === marca.ID_Marca);
    setModelosFiltrados(filtrados);
    setFormData({ 
      ...formData, 
      Nombre_Marca: marca.Nombre_Marca, 
      ID_Modelo: '', 
      Nombre_Modelo: 'Seleccionar Modelo...' 
    });
    setModalMarcasVisible(false);
  };

  const seleccionarModelo = (modelo) => {
    setFormData({ 
      ...formData, 
      ID_Modelo: modelo.ID_Modelo.toString(), 
      Nombre_Modelo: modelo.Nombre_Modelo 
    });
    setModalModelosVisible(false);
  };

  const handleChange = (campo, valor) => {
    setFormData({ ...formData, [campo]: valor });
  };

  const handleGuardar = async () => {
    if (!formData.Placa || !formData.ID_Modelo) {
      Alert.alert('Error', 'La Placa y el Modelo son obligatorios');
      return;
    }

    setLoading(true);
    const payload = {
      Placa: formData.Placa.toUpperCase().trim(),
      ID_Modelo: parseInt(formData.ID_Modelo),
      Anio: formData.Anio ? parseInt(formData.Anio) : null,
      Color: formData.Color || null,
      ID_Usuario: user.id,
      ID_Estado: 1
    };

    const result = await vehicleService.create(payload);
    setLoading(false);

    if (result.success) {
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigation.goBack();
      }, 1500);
    } else {
      Alert.alert('❌ Error', result.message || "No se pudo registrar el vehículo");
    }
  };

  if (cargandoCatalogos || !fontsLoaded) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#114B5F" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header con flecha de regreso */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={28} color="#114B5F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nuevo Vehículo</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            {/* Icono y título decorativo */}
            <View style={styles.iconContainer}>
              <Icon name="car-sport-outline" size={50} color="#114B5F" />
              <Text style={styles.subtitle}>Registra tu vehículo para acceder al estacionamiento</Text>
            </View>

            {/* SELECCIÓN DE MARCA */}
            <Text style={styles.label}>Marca *</Text>
            <TouchableOpacity style={styles.selectorCustom} onPress={() => setModalMarcasVisible(true)}>
              <Text style={[styles.selectorTxt, formData.Nombre_Marca === 'Seleccionar Marca...' && { color: '#999' }]}>
                {formData.Nombre_Marca}
              </Text>
              <Icon name="chevron-down" size={20} color="#114B5F" />
            </TouchableOpacity>

            {/* SELECCIÓN DE MODELO */}
            <Text style={styles.label}>Modelo *</Text>
            <TouchableOpacity 
              style={[styles.selectorCustom, formData.Nombre_Marca.includes('Seleccionar') && { opacity: 0.5, backgroundColor: '#F5F5F5' }]} 
              onPress={() => formData.Nombre_Marca.includes('Seleccionar') ? Alert.alert('Aviso', 'Selecciona primero una marca') : setModalModelosVisible(true)}
            >
              <Text style={[styles.selectorTxt, formData.Nombre_Modelo === 'Seleccionar Modelo...' && { color: '#999' }]}>
                {formData.Nombre_Modelo}
              </Text>
              <Icon name="chevron-down" size={20} color="#114B5F" />
            </TouchableOpacity>

            {/* PLACA */}
            <Text style={styles.label}>Placa *</Text>
            <TextInput 
              style={styles.input} 
              value={formData.Placa} 
              onChangeText={(v) => handleChange('Placa', v)} 
              placeholder="Ej: ABC-123"
              placeholderTextColor="#999"
              autoCapitalize="characters"
            />

            {/* FILA AÑO Y COLOR */}
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.label}>Año</Text>
                <TextInput 
                  style={styles.input} 
                  value={formData.Anio} 
                  onChangeText={(v) => handleChange('Anio', v)} 
                  placeholder="2024"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  maxLength={4}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.label}>Color</Text>
                <TextInput 
                  style={styles.input} 
                  value={formData.Color} 
                  onChangeText={(v) => handleChange('Color', v)} 
                  placeholder="Blanco, Rojo, Azul..."
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            {/* Botones */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleGuardar} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Registrar Vehículo</Text>}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* MODAL MARCAS */}
      <Modal visible={modalMarcasVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Marca</Text>
            <FlatList
              data={marcas}
              keyExtractor={(item) => item.ID_Marca.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalItem} onPress={() => seleccionarMarca(item)}>
                  <Text style={styles.modalItemText}>{item.Nombre_Marca}</Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalMarcasVisible(false)}>
              <Text style={styles.modalCloseText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL MODELOS */}
      <Modal visible={modalModelosVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modelos de {formData.Nombre_Marca}</Text>
            {modelosFiltrados.length === 0 ? (
              <Text style={styles.emptyText}>No hay modelos disponibles para esta marca</Text>
            ) : (
              <FlatList
                data={modelosFiltrados}
                keyExtractor={(item) => item.ID_Modelo.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.modalItem} onPress={() => seleccionarModelo(item)}>
                    <Text style={styles.modalItemText}>{item.Nombre_Modelo}</Text>
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
              />
            )}
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalModelosVisible(false)}>
              <Text style={styles.modalCloseText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL ÉXITO */}
      <Modal transparent visible={showSuccessModal} animationType="fade">
        <View style={styles.successOverlay}>
          <View style={styles.successContent}>
            <Icon name="checkmark-circle" size={80} color="#4CAF50" />
            <Text style={styles.successTitle}>¡Registrado!</Text>
            <Text style={styles.successText}>Tu vehículo ha sido registrado exitosamente</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#C8DFEA' 
  },
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#C8DFEA'
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#114B5F',
  },
  
  scrollContent: { 
    padding: 20,
    paddingBottom: 40,
  },
  
  iconContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  subtitle: {
    fontSize: 14,
    color: '#365563',
    textAlign: 'center',
    marginTop: 8,
  },
  
  label: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#114B5F', 
    marginBottom: 6, 
    marginTop: 15,
    marginLeft: 5,
  },
  
  input: { 
    backgroundColor: '#FFF', 
    borderRadius: 12, 
    padding: 14, 
    fontSize: 16, 
    borderWidth: 1, 
    borderColor: '#E0E0E0', 
    color: '#333',
  },
  
  row: { 
    flexDirection: 'row',
    marginTop: 5,
  },
  
  selectorCustom: { 
    backgroundColor: '#FFF', 
    borderRadius: 12, 
    padding: 14, 
    borderWidth: 1, 
    borderColor: '#E0E0E0', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
  },
  selectorTxt: { 
    fontSize: 16, 
    color: '#333',
  },
  
  buttonContainer: { 
    flexDirection: 'row', 
    marginTop: 35, 
    marginBottom: 20,
    gap: 12,
  },
  cancelButton: { 
    flex: 1, 
    padding: 15, 
    backgroundColor: '#9e9e9e', 
    borderRadius: 12, 
    alignItems: 'center',
  },
  saveButton: { 
    flex: 2, 
    padding: 15, 
    backgroundColor: '#114B5F', 
    borderRadius: 12, 
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16,
  },
  
  // Modales
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalContent: { 
    backgroundColor: '#FFF', 
    borderRadius: 20, 
    padding: 20, 
    width: '85%', 
    maxHeight: '70%' 
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#114B5F', 
    textAlign: 'center', 
    marginBottom: 20 
  },
  modalItem: { 
    paddingVertical: 14, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F0F0F0' 
  },
  modalItemText: { 
    fontSize: 16, 
    color: '#333', 
    textAlign: 'center' 
  },
  modalCloseButton: { 
    marginTop: 20, 
    padding: 12, 
    backgroundColor: '#114B5F', 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  modalCloseText: { 
    color: '#FFF', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  emptyText: { 
    textAlign: 'center', 
    color: '#999', 
    padding: 20 
  },
  
  // Modal de éxito
  successOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(17, 75, 95, 0.9)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  successContent: { 
    backgroundColor: '#FFF', 
    borderRadius: 25, 
    padding: 30, 
    alignItems: 'center', 
    width: '80%' 
  },
  successTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#4CAF50', 
    marginTop: 15, 
    marginBottom: 10 
  },
  successText: { 
    fontSize: 14, 
    color: '#666', 
    textAlign: 'center' 
  },
});