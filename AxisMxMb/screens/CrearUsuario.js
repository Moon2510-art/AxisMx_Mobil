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
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Modal, // <--- Usaremos Modal en lugar de Picker
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { userService, rolService } from '../../services/api';

export default function CrearUsuario({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // Control del selector
  const [cargandoRoles, setCargandoRoles] = useState(true);
  
  const [formData, setFormData] = useState({
    Nombre: '',
    Ap_Paterno: '',
    Ap_Materno: '',
    Email: '',
    Matricula: '',
    Numero_Empleado: '',
    Telefono: '',
    Password: '',
    Password_confirmation: '',
    ID_Rol: '',      
    Nombre_Rol: 'Selecciona un rol...', // Para mostrar en el botón
    ID_Estado: '1'   
  });

  useEffect(() => {
    const obtenerRoles = async () => {
      const result = await rolService.getAll();
      if (result.success) setRoles(result.data);
      setCargandoRoles(false);
    };
    obtenerRoles();
  }, []);

  const handleChange = (campo, valor) => {
    setFormData({ ...formData, [campo]: valor });
  };

  const seleccionarRol = (rol) => {
    setFormData({ 
      ...formData, 
      ID_Rol: rol.ID_Rol.toString(), 
      Nombre_Rol: rol.Nombre_Rol 
    });
    setModalVisible(false);
  };

  const handleGuardar = async () => {
    if (!formData.Nombre || !formData.Email || !formData.ID_Rol || !formData.Password) {
      Alert.alert('Atención', 'Nombre, Email, Rol y Contraseña son obligatorios.');
      return;
    }
    // ... resto de tus validaciones de password igual ...
    
    setLoading(true);
    const result = await userService.create({
      ...formData,
      ID_Rol: parseInt(formData.ID_Rol),
      ID_Estado: parseInt(formData.ID_Estado)
    });
    setLoading(false);

    if (result.success) {
      Alert.alert('Éxito', 'Usuario creado', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            <Text style={styles.title}>Nuevo Usuario</Text>

            {/* CAMPOS DE TEXTO */}
            <Text style={styles.label}>Nombre *</Text>
            <TextInput style={styles.input} value={formData.Nombre} onChangeText={(v) => handleChange('Nombre', v)} placeholder="Nombre" />

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 5 }}>
                <Text style={styles.label}>Ap. Paterno *</Text>
                <TextInput style={styles.input} value={formData.Ap_Paterno} onChangeText={(v) => handleChange('Ap_Paterno', v)} placeholder="Paterno" />
              </View>
              <View style={{ flex: 1, marginLeft: 5 }}>
                <Text style={styles.label}>Ap. Materno</Text>
                <TextInput style={styles.input} value={formData.Ap_Materno} onChangeText={(v) => handleChange('Ap_Materno', v)} placeholder="Materno" />
              </View>
            </View>

            <Text style={styles.label}>Email *</Text>
            <TextInput style={styles.input} value={formData.Email} onChangeText={(v) => handleChange('Email', v)} placeholder="correo@axis.mx" keyboardType="email-address" autoCapitalize="none" />

            {/* ROL DE USUARIO - SELECTOR CUSTOM (MODAL) */}
            <Text style={styles.label}>Rol de Usuario *</Text>
            <TouchableOpacity 
              style={styles.selectorCustom} 
              onPress={() => setModalVisible(true)}
            >
              <Text style={[styles.selectorTxt, formData.ID_Rol === '' && { color: '#999' }]}>
                {formData.Nombre_Rol}
              </Text>
              <Text style={{ color: '#114B5F' }}>▼</Text>
            </TouchableOpacity>

            {/* ESTADO - BOTONES */}
            <Text style={styles.label}>Estado Inicial</Text>
            <View style={styles.estadoContainer}>
              <TouchableOpacity 
                style={[styles.estadoBtn, formData.ID_Estado === '1' && styles.btnActivo]} 
                onPress={() => handleChange('ID_Estado', '1')}
              >
                <Text style={[styles.estadoTxt, formData.ID_Estado === '1' && styles.txtWhite]}>Activo</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.estadoBtn, formData.ID_Estado === '2' && styles.btnInactivo]} 
                onPress={() => handleChange('ID_Estado', '2')}
              >
                <Text style={[styles.estadoTxt, formData.ID_Estado === '2' && styles.txtWhite]}>Inactivo</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Matrícula / Núm. Empleado</Text>
            <TextInput style={styles.input} value={formData.Matricula} onChangeText={(v) => handleChange('Matricula', v)} placeholder="Identificador" />

            <Text style={styles.label}>Contraseña *</Text>
            <TextInput style={styles.input} value={formData.Password} onChangeText={(v) => handleChange('Password', v)} placeholder="******" secureTextEntry />

            <Text style={styles.label}>Confirmar Contraseña *</Text>
            <TextInput style={styles.input} value={formData.Password_confirmation} onChangeText={(v) => handleChange('Password_confirmation', v)} placeholder="******" secureTextEntry />

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleGuardar} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Crear Usuario</Text>}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* MODAL DEL SELECTOR DE ROL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona un Rol</Text>
            <FlatList
              data={roles}
              keyExtractor={(item) => item.ID_Rol.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.rolItem} onPress={() => seleccionarRol(item)}>
                  <Text style={styles.rolItemTxt}>{item.Nombre_Rol}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeModal} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeModalTxt}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContent: { padding: 25 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#114B5F', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: '700', color: '#444', marginBottom: 5, marginTop: 15 },
  input: { backgroundColor: '#fff', borderRadius: 12, padding: 12, fontSize: 16, borderWidth: 1, borderColor: '#ddd' },
  row: { flexDirection: 'row' },
  
  // Estilo del Selector que reemplaza al Picker
  selectorCustom: { 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    padding: 15, 
    borderWidth: 1, 
    borderColor: '#ddd', 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  selectorTxt: { fontSize: 16, color: '#333' },

  estadoContainer: { flexDirection: 'row', gap: 10, marginTop: 5 },
  estadoBtn: { flex: 1, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#ddd', alignItems: 'center', backgroundColor: '#fff' },
  btnActivo: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  btnInactivo: { backgroundColor: '#F44336', borderColor: '#F44336' },
  estadoTxt: { fontWeight: '600', color: '#666' },
  txtWhite: { color: '#fff' },

  buttonContainer: { flexDirection: 'row', marginTop: 40, marginBottom: 30 },
  cancelButton: { flex: 1, padding: 16, backgroundColor: '#9e9e9e', borderRadius: 12, marginRight: 10, alignItems: 'center' },
  saveButton: { flex: 2, padding: 16, backgroundColor: '#114B5F', borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  // Estilos del Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '50%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#114B5F' },
  rolItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  rolItemTxt: { fontSize: 16, textAlign: 'center', color: '#333' },
  closeModal: { marginTop: 10, padding: 15, alignItems: 'center' },
  closeModalTxt: { color: '#F44336', fontWeight: 'bold' }
});