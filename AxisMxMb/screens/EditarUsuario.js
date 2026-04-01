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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/Ionicons';
import { userService, rolService } from '../services/api';

export default function EditarUsuario({ route, navigation }) {
  const { usuario } = route.params;
  
  const [fontsLoaded] = useFonts({
    Ultra: require("../assets/fonts/DelaGothicOne-Regular.ttf"),
  });

  const [loading, setLoading] = useState(false);
  const [cargandoRoles, setCargandoRoles] = useState(true);
  const [modalRolesVisible, setModalRolesVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    Nombre: '',
    Ap_Paterno: '',
    Ap_Materno: '',
    Email: '',
    Telefono: '',
    Matricula: '',
    ID_Rol: '',
    Nombre_Rol: 'Selecciona un rol...',
    ID_Estado: '1',
    Codigo_Credencial: '',  // NUEVO CAMPO
    Password: ''
  });

  useEffect(() => {
    cargarRoles();
  }, []);

  useEffect(() => {
    if (!cargandoRoles && usuario && roles.length > 0) {
      const rolActual = roles.find(r => r.ID_Rol === usuario.ID_Rol);
      setFormData({
        Nombre: usuario.Nombre || '',
        Ap_Paterno: usuario.Ap_Paterno || '',
        Ap_Materno: usuario.Ap_Materno || '',
        Email: usuario.Email || '',
        Telefono: usuario.Telefono || '',
        Matricula: usuario.Matricula || '',
        ID_Rol: usuario.ID_Rol ? usuario.ID_Rol.toString() : '',
        Nombre_Rol: rolActual ? rolActual.Nombre_Rol : 'Selecciona un rol...',
        ID_Estado: usuario.ID_Estado ? usuario.ID_Estado.toString() : '1',
        Codigo_Credencial: usuario.Codigo_Credencial || '',  // NUEVO
        Password: '' 
      });
    }
  }, [cargandoRoles, usuario, roles]);

  const cargarRoles = async () => {
    const result = await rolService.getAll();
    if (result.success) setRoles(result.data);
    setCargandoRoles(false);
  };

  const handleChange = (campo, valor) => setFormData({ ...formData, [campo]: valor });

  const seleccionarRol = (rol) => {
    setFormData({ ...formData, ID_Rol: rol.ID_Rol.toString(), Nombre_Rol: rol.Nombre_Rol });
    setModalRolesVisible(false);
  };

  const handleGuardar = async () => {
    if (!formData.Nombre || !formData.Email || !formData.ID_Rol) {
      Alert.alert('Error', 'Nombre, Email y Rol son obligatorios');
      return;
    }

    setLoading(true);
    
    const datosActualizados = {
      Nombre: formData.Nombre,
      Ap_Paterno: formData.Ap_Paterno,
      Ap_Materno: formData.Ap_Materno,
      Email: formData.Email,
      Telefono: formData.Telefono,
      Matricula: formData.Matricula,
      ID_Rol: parseInt(formData.ID_Rol),
      ID_Estado: parseInt(formData.ID_Estado),
      Codigo_Credencial: formData.Codigo_Credencial  // NUEVO
    };

    if (formData.Password && formData.Password.trim().length > 0) {
      datosActualizados.Password = formData.Password;
    }

    const result = await userService.update(usuario.ID_Usuario, datosActualizados);
    setLoading(false);

    if (result.success) {
      Alert.alert('✅ Éxito', 'Usuario actualizado correctamente', [
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
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.headerForm}>
          <Icon name="person-circle-outline" size={60} color="#114B5F" />
          <Text style={styles.ultraTitle}>Editar Usuario</Text>
        </View>

        <Text style={styles.label}>Nombre(s) *</Text>
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

        <Text style={styles.label}>Correo Electrónico *</Text>
        <TextInput style={styles.input} value={formData.Email} onChangeText={(v) => handleChange('Email', v)} keyboardType="email-address" autoCapitalize="none" />

        {/* NUEVO CAMPO: NÚMERO DE CREDENCIAL */}
        <Text style={styles.label}>Número de Credencial</Text>
        <TextInput 
          style={styles.input} 
          value={formData.Codigo_Credencial} 
          onChangeText={(v) => handleChange('Codigo_Credencial', v)} 
          placeholder="Código impreso en la tarjeta"
          keyboardType="numeric"
        />
        <Text style={styles.helperText}>
          Este número se escanea con OCR para accesos peatonales
        </Text>

        {/* SECCIÓN DE SEGURIDAD */}
        <View style={styles.securitySection}>
          <Text style={styles.label}>Nueva Contraseña (Opcional)</Text>
          <View style={styles.passwordContainer}>
            <TextInput 
              style={styles.passwordInput} 
              value={formData.Password} 
              onChangeText={(v) => handleChange('Password', v)} 
              placeholder="Dejar vacío para mantener actual"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon name={showPassword ? "eye-off" : "eye"} size={24} color="#114B5F" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 5 }}>
            <Text style={styles.label}>Matrícula</Text>
            <TextInput style={styles.input} value={formData.Matricula} onChangeText={(v) => handleChange('Matricula', v)} placeholder="ID" />
          </View>
          <View style={{ flex: 1, marginLeft: 5 }}>
            <Text style={styles.label}>Teléfono</Text>
            <TextInput style={styles.input} value={formData.Telefono} onChangeText={(v) => handleChange('Telefono', v)} keyboardType="phone-pad" />
          </View>
        </View>

        <Text style={styles.label}>Asignar Rol *</Text>
        <TouchableOpacity style={styles.selectorCustom} onPress={() => setModalRolesVisible(true)}>
          <Text style={styles.selectorTxt}>{formData.Nombre_Rol}</Text>
          <Icon name="chevron-down" size={20} color="#114B5F" />
        </TouchableOpacity>

        <Text style={styles.label}>Estado del Usuario</Text>
        <View style={styles.estadoContainer}>
          <TouchableOpacity 
            style={[styles.estadoButton, formData.ID_Estado === '1' && styles.estadoActivo]} 
            onPress={() => handleChange('ID_Estado', '1')}
          >
            <Text style={[styles.estadoButtonText, formData.ID_Estado === '1' && styles.estadoButtonTextWhite]}>Activo</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.estadoButton, formData.ID_Estado === '2' && styles.estadoInactivo]} 
            onPress={() => handleChange('ID_Estado', '2')}
          >
            <Text style={[styles.estadoButtonText, formData.ID_Estado === '2' && styles.estadoButtonTextWhite]}>Inactivo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleGuardar} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Guardar Cambios</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* MODAL DE SELECCIÓN DE ROL */}
      <Modal visible={modalRolesVisible} transparent animationType="slide">
        <View style={styles.modalRolesOverlay}>
          <View style={styles.modalRolesContent}>
            <Text style={[styles.modalRolesTitle, { fontFamily: 'Ultra' }]}>Roles Disponibles</Text>
            <FlatList
              data={roles}
              keyExtractor={(item) => item.ID_Rol.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.rolOption} onPress={() => seleccionarRol(item)}>
                  <Text style={[styles.rolOptionTxt, formData.ID_Rol === item.ID_Rol.toString() && { fontWeight: 'bold', color: '#114B5F' }]}>
                    {item.Nombre_Rol}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.btnCerrarRol} onPress={() => setModalRolesVisible(false)}>
              <Text style={{ color: '#f44336', fontWeight: 'bold' }}>CANCELAR</Text>
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
  passwordContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 15, paddingHorizontal: 15, borderWidth: 1, borderColor: '#E1E8ED', elevation: 2 },
  passwordInput: { flex: 1, paddingVertical: 15, fontSize: 16, color: '#333' },
  securitySection: { marginTop: 5, padding: 10, backgroundColor: '#E8F0F2', borderRadius: 20, borderWidth: 1, borderColor: '#CADEE3' },
  selectorCustom: { backgroundColor: '#fff', borderRadius: 15, padding: 15, borderWidth: 1, borderColor: '#E1E8ED', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
  selectorTxt: { fontSize: 16, color: '#333' },
  estadoContainer: { flexDirection: 'row', gap: 10, marginTop: 5 },
  estadoButton: { flex: 1, padding: 14, borderRadius: 15, borderWidth: 1, borderColor: '#ddd', alignItems: 'center', backgroundColor: '#fff' },
  estadoActivo: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  estadoInactivo: { backgroundColor: '#f44336', borderColor: '#f44336' },
  estadoButtonText: { color: '#666', fontWeight: '700' },
  estadoButtonTextWhite: { color: '#fff' },
  buttonContainer: { flexDirection: 'row', marginTop: 35, marginBottom: 30 },
  cancelButton: { flex: 1, padding: 18, backgroundColor: '#9e9e9e', borderRadius: 15, marginRight: 10, alignItems: 'center' },
  saveButton: { flex: 2, padding: 18, backgroundColor: '#114B5F', borderRadius: 15, alignItems: 'center', elevation: 4 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  modalRolesOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalRolesContent: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 30, maxHeight: '60%' },
  modalRolesTitle: { fontSize: 20, marginBottom: 20, textAlign: 'center', color: '#114B5F' },
  rolOption: { paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F0F4F7' },
  rolOptionTxt: { fontSize: 16, textAlign: 'center', color: '#444' },
  btnCerrarRol: { marginTop: 20, padding: 10, alignItems: 'center' },
});