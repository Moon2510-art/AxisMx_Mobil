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
  Modal,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/Ionicons';
import { userService, rolService } from '../services/api';

export default function CrearUsuario({ navigation }) {
  const [fontsLoaded] = useFonts({
    Ultra: require("../assets/fonts/DelaGothicOne-Regular.ttf"),
  });

  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [cargandoRoles, setCargandoRoles] = useState(true);
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    email: '',
    matricula: '',
    numero_empleado: '',
    telefono: '',
    password: '',
    password_confirmation: '',
    ID_Rol: '',
    nombre_rol: 'Selecciona un rol...',
    ID_Estado: '1',
    codigo_credencial: ''  // NUEVO CAMPO
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
      nombre_rol: rol.Nombre_Rol 
    });
    setModalVisible(false);
  };

  const handleGuardar = async () => {
    // Validaciones
    if (!formData.nombre || !formData.email || !formData.ID_Rol || !formData.password) {
      Alert.alert('Atención', 'Nombre, Email, Rol y Contraseña son obligatorios.');
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (!formData.matricula && !formData.numero_empleado) {
      Alert.alert('Error', 'Debes ingresar matrícula o número de empleado');
      return;
    }

    // VALIDAR NÚMERO DE CREDENCIAL
    if (!formData.codigo_credencial) {
      Alert.alert('Error', 'El número de credencial es obligatorio');
      return;
    }

    if (formData.codigo_credencial.length < 8) {
      Alert.alert('Error', 'El número de credencial debe tener al menos 8 dígitos');
      return;
    }

    setLoading(true);
    
    const result = await userService.create({
      nombre: formData.nombre,
      apellido_paterno: formData.apellido_paterno,
      apellido_materno: formData.apellido_materno,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.password_confirmation,
      matricula: formData.matricula,
      numero_empleado: formData.numero_empleado,
      telefono: formData.telefono,
      ID_Rol: parseInt(formData.ID_Rol),
      ID_Estado: parseInt(formData.ID_Estado),
      codigo_credencial: formData.codigo_credencial  // NUEVO
    });
    
    setLoading(false);

    if (result.success) {
      Alert.alert('✅ Éxito', 'Usuario creado correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert('❌ Error', result.message);
    }
  };

  if (cargandoRoles || !fontsLoaded) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#114B5F" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            <View style={styles.headerForm}>
              <Icon name="person-add-outline" size={60} color="#114B5F" />
              <Text style={styles.ultraTitle}>Nuevo Usuario</Text>
            </View>

            <Text style={styles.label}>Nombre *</Text>
            <TextInput 
              style={styles.input} 
              value={formData.nombre} 
              onChangeText={(v) => handleChange('nombre', v)} 
              placeholder="Nombre" 
            />

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 5 }}>
                <Text style={styles.label}>Ap. Paterno *</Text>
                <TextInput 
                  style={styles.input} 
                  value={formData.apellido_paterno} 
                  onChangeText={(v) => handleChange('apellido_paterno', v)} 
                  placeholder="Paterno" 
                />
              </View>
              <View style={{ flex: 1, marginLeft: 5 }}>
                <Text style={styles.label}>Ap. Materno</Text>
                <TextInput 
                  style={styles.input} 
                  value={formData.apellido_materno} 
                  onChangeText={(v) => handleChange('apellido_materno', v)} 
                  placeholder="Materno" 
                />
              </View>
            </View>

            <Text style={styles.label}>Email *</Text>
            <TextInput 
              style={styles.input} 
              value={formData.email} 
              onChangeText={(v) => handleChange('email', v)} 
              placeholder="correo@axis.mx" 
              keyboardType="email-address" 
              autoCapitalize="none" 
            />

            {/* NÚMERO DE CREDENCIAL */}
            <Text style={styles.label}>Número de Credencial *</Text>
            <TextInput 
              style={styles.input} 
              value={formData.codigo_credencial} 
              onChangeText={(v) => handleChange('codigo_credencial', v)} 
              placeholder="Ej: 0007194528 109,511104"
              keyboardType="numeric"
            />
            <Text style={styles.helperText}>
              Código impreso en la tarjeta de acceso (8+ dígitos)
            </Text>

            <Text style={styles.label}>Rol de Usuario *</Text>
            <TouchableOpacity 
              style={styles.selectorCustom} 
              onPress={() => setModalVisible(true)}
            >
              <Text style={[styles.selectorTxt, formData.ID_Rol === '' && { color: '#999' }]}>
                {formData.nombre_rol}
              </Text>
              <Icon name="chevron-down" size={20} color="#114B5F" />
            </TouchableOpacity>

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
            <TextInput 
              style={styles.input} 
              value={formData.matricula} 
              onChangeText={(v) => handleChange('matricula', v)} 
              placeholder="Identificador" 
            />

            <Text style={styles.label}>Teléfono</Text>
            <TextInput 
              style={styles.input} 
              value={formData.telefono} 
              onChangeText={(v) => handleChange('telefono', v)} 
              placeholder="Teléfono" 
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Contraseña *</Text>
            <TextInput 
              style={styles.input} 
              value={formData.password} 
              onChangeText={(v) => handleChange('password', v)} 
              placeholder="******" 
              secureTextEntry 
            />

            <Text style={styles.label}>Confirmar Contraseña *</Text>
            <TextInput 
              style={styles.input} 
              value={formData.password_confirmation} 
              onChangeText={(v) => handleChange('password_confirmation', v)} 
              placeholder="******" 
              secureTextEntry 
            />

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

      {/* MODAL PARA SELECCIONAR ROL */}
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
  container: { flex: 1, backgroundColor: '#F0F4F7' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20 },
  headerForm: { alignItems: 'center', marginBottom: 20 },
  ultraTitle: { fontSize: 28, color: '#114B5F', fontFamily: "Ultra", marginTop: 10 },
  label: { fontSize: 13, fontWeight: '700', color: '#114B5F', marginBottom: 5, marginTop: 15, marginLeft: 5 },
  input: { backgroundColor: '#fff', borderRadius: 15, padding: 15, fontSize: 16, borderWidth: 1, borderColor: '#E1E8ED', color: '#333', elevation: 2 },
  row: { flexDirection: 'row' },
  helperText: { fontSize: 11, color: '#666', marginTop: 2, marginBottom: 5, marginLeft: 8 },
  selectorCustom: { backgroundColor: '#fff', borderRadius: 15, padding: 15, borderWidth: 1, borderColor: '#E1E8ED', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
  selectorTxt: { fontSize: 16, color: '#333' },
  estadoContainer: { flexDirection: 'row', gap: 10, marginTop: 5 },
  estadoBtn: { flex: 1, padding: 14, borderRadius: 15, borderWidth: 1, borderColor: '#ddd', alignItems: 'center', backgroundColor: '#fff' },
  btnActivo: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  btnInactivo: { backgroundColor: '#f44336', borderColor: '#f44336' },
  estadoTxt: { fontWeight: '600', color: '#666' },
  txtWhite: { color: '#fff' },
  buttonContainer: { flexDirection: 'row', marginTop: 35, marginBottom: 30 },
  cancelButton: { flex: 1, padding: 18, backgroundColor: '#9e9e9e', borderRadius: 15, marginRight: 10, alignItems: 'center' },
  saveButton: { flex: 2, padding: 18, backgroundColor: '#114B5F', borderRadius: 15, alignItems: 'center', elevation: 4 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 20, padding: 20, width: '85%', maxHeight: '70%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#114B5F' },
  rolItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  rolItemTxt: { fontSize: 16, textAlign: 'center', color: '#333' },
  closeModal: { marginTop: 10, padding: 15, alignItems: 'center' },
  closeModalTxt: { color: '#f44336', fontWeight: 'bold' },
});