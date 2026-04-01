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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { vehicleService, marcaService, modeloService } from '../../services/api';

export default function EditarVehiculo({ route, navigation }) {
  const { vehiculo } = route.params;
  
  const [loading, setLoading] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [modelosFiltrados, setModelosFiltrados] = useState([]);
  
  const [formData, setFormData] = useState({
    Placa: '',
    ID_Marca: '',
    ID_Modelo: '',
    Anio: '',
    Color: '',
    ID_Estado: ''
  });

  // Cargar marcas y modelos AL INICIO
  useEffect(() => {
    cargarDatos();
  }, []);

  // DESPUÉS de cargar marcas y modelos, cargar los datos del vehículo
  useEffect(() => {
    if (!cargando && marcas.length > 0 && modelos.length > 0) {
      // Buscar la marca del vehículo actual
      const modeloActual = modelos.find(m => m.ID_Modelo === vehiculo.ID_Modelo);
      const marcaId = modeloActual ? modeloActual.ID_Marca.toString() : '';
      
      setFormData({
        Placa: vehiculo.Placa || '',
        ID_Marca: marcaId,
        ID_Modelo: vehiculo.ID_Modelo ? vehiculo.ID_Modelo.toString() : '',
        Anio: vehiculo.Anio ? vehiculo.Anio.toString() : '',
        Color: vehiculo.Color || '',
        ID_Estado: vehiculo.ID_Estado ? vehiculo.ID_Estado.toString() : '1'
      });
    }
  }, [cargando, marcas, modelos]);

  // Filtrar modelos cuando cambia la marca seleccionada
  useEffect(() => {
    if (formData.ID_Marca) {
      const filtrados = modelos.filter(m => m.ID_Marca.toString() === formData.ID_Marca);
      setModelosFiltrados(filtrados);
    } else {
      setModelosFiltrados([]);
    }
  }, [formData.ID_Marca, modelos]);

  const cargarDatos = async () => {
    setCargando(true);
    
    const marcasResult = await marcaService.getAll();
    if (marcasResult.success) {
      setMarcas(marcasResult.data);
    }
    
    const modelosResult = await modeloService.getAll();
    if (modelosResult.success) {
      setModelos(modelosResult.data);
    }
    
    setCargando(false);
  };

  const handleChange = (campo, valor) => {
    setFormData({
      ...formData,
      [campo]: valor
    });
  };

  const handleGuardar = async () => {
    if (!formData.Placa || !formData.ID_Modelo) {
      Alert.alert('Error', 'Placa y modelo son obligatorios');
      return;
    }

    setLoading(true);
    
    const datos = {
      Placa: formData.Placa.toUpperCase(),
      ID_Modelo: parseInt(formData.ID_Modelo),
      Anio: formData.Anio ? parseInt(formData.Anio) : null,
      Color: formData.Color || null,
      ID_Estado: parseInt(formData.ID_Estado)
    };

    const result = await vehicleService.update(vehiculo.ID_Vehiculo, datos);
    setLoading(false);

    if (result.success) {
      Alert.alert('✅ Éxito', `Vehículo ${formData.Placa.toUpperCase()} actualizado correctamente`, [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert('❌ Error', result.message);
    }
  };

  if (cargando) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#114B5F" />
        <Text style={styles.loadingText}>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Editar Vehículo</Text>

        <Text style={styles.label}>Placa *</Text>
        <TextInput
          style={styles.input}
          value={formData.Placa}
          onChangeText={(text) => handleChange('Placa', text)}
          placeholder="ABC-123"
          autoCapitalize="characters"
        />

        <Text style={styles.label}>Marca *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.ID_Marca}
            onValueChange={(itemValue) => handleChange('ID_Marca', itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccionar marca" value="" />
            {marcas.map((marca) => (
              <Picker.Item 
                key={marca.ID_Marca}
                label={marca.Nombre_Marca}
                value={marca.ID_Marca.toString()}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Modelo *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.ID_Modelo}
            onValueChange={(itemValue) => handleChange('ID_Modelo', itemValue)}
            style={styles.picker}
            enabled={!!formData.ID_Marca}
          >
            <Picker.Item 
              label={formData.ID_Marca ? "Seleccionar modelo" : "Primero selecciona una marca"} 
              value="" 
            />
            {modelosFiltrados.map((modelo) => (
              <Picker.Item 
                key={modelo.ID_Modelo}
                label={modelo.Nombre_Modelo}
                value={modelo.ID_Modelo.toString()}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Año</Text>
        <TextInput
          style={styles.input}
          value={formData.Anio}
          onChangeText={(text) => handleChange('Anio', text)}
          placeholder="2020"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Color</Text>
        <TextInput
          style={styles.input}
          value={formData.Color}
          onChangeText={(text) => handleChange('Color', text)}
          placeholder="Rojo, Azul, etc."
        />

        <Text style={styles.label}>Estado</Text>
        <View style={styles.estadoContainer}>
          <TouchableOpacity 
            style={[styles.estadoButton, formData.ID_Estado === '1' && styles.estadoActivo]}
            onPress={() => handleChange('ID_Estado', '1')}
          >
            <Text style={[styles.estadoButtonText, formData.ID_Estado === '1' && styles.estadoButtonTextWhite]}>
              Activo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.estadoButton, formData.ID_Estado === '2' && styles.estadoInactivo]}
            onPress={() => handleChange('ID_Estado', '2')}
          >
            <Text style={[styles.estadoButtonText, formData.ID_Estado === '2' && styles.estadoButtonTextWhite]}>
              Inactivo
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.saveButton} onPress={handleGuardar} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Guardar</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    color: '#365563',
    fontSize: 14,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#114B5F',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  estadoContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  estadoButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  estadoActivo: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  estadoInactivo: {
    backgroundColor: '#f44336',
    borderColor: '#f44336',
  },
  estadoButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  estadoButtonTextWhite: {
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 40,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});