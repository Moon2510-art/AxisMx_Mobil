import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

export default function RegistroUsuario({ navigation }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    email: '',
    password: '',
    password_confirmation: '',
    matricula: '',
    numero_empleado: '',
    telefono: '',
    codigo_credencial: '',  // NUEVO CAMPO
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleRegister = async () => {
    // Validaciones básicas
    if (!formData.nombre || !formData.apellido_paterno || !formData.email || !formData.password) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
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

    // Validar que tenga matrícula o número de empleado
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
    const result = await register(formData);
    setLoading(false);

    if (result.success) {
      Alert.alert(
        'Registro exitoso',
        'Tu cuenta ha sido creada. Un administrador debe activarla antes de que puedas iniciar sesión.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } else {
      Alert.alert('Error', result.message);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Crear cuenta</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Nombre *</Text>
        <TextInput
          style={styles.input}
          placeholder="Tu nombre"
          value={formData.nombre}
          onChangeText={(value) => handleChange('nombre', value)}
        />

        <Text style={styles.label}>Apellido Paterno *</Text>
        <TextInput
          style={styles.input}
          placeholder="Tu apellido paterno"
          value={formData.apellido_paterno}
          onChangeText={(value) => handleChange('apellido_paterno', value)}
        />

        <Text style={styles.label}>Apellido Materno</Text>
        <TextInput
          style={styles.input}
          placeholder="Tu apellido materno (opcional)"
          value={formData.apellido_materno}
          onChangeText={(value) => handleChange('apellido_materno', value)}
        />

        <Text style={styles.label}>Correo electrónico *</Text>
        <TextInput
          style={styles.input}
          placeholder="correo@ejemplo.com"
          value={formData.email}
          onChangeText={(value) => handleChange('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Matrícula</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. 124048965"
          value={formData.matricula}
          onChangeText={(value) => handleChange('matricula', value)}
          autoCapitalize="characters"
        />

        <Text style={styles.label}>Número de Empleado</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. EMP001"
          value={formData.numero_empleado}
          onChangeText={(value) => handleChange('numero_empleado', value)}
        />

        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          placeholder="4421234567"
          value={formData.telefono}
          onChangeText={(value) => handleChange('telefono', value)}
          keyboardType="phone-pad"
        />

        {/* NUEVO CAMPO: NÚMERO DE CREDENCIAL */}
        <Text style={styles.label}>Número de Credencial *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. 0007194528 109,51104"
          value={formData.codigo_credencial}
          onChangeText={(value) => handleChange('codigo_credencial', value)}
          keyboardType="numeric"
          autoCapitalize="none"
        />
        <Text style={styles.helperText}>
          Este número está impreso en tu tarjeta de credencial. Se usará para acceder a las instalaciones.
        </Text>

        <Text style={styles.label}>Contraseña *</Text>
        <TextInput
          style={styles.input}
          placeholder="Mínimo 6 caracteres"
          value={formData.password}
          onChangeText={(value) => handleChange('password', value)}
          secureTextEntry
        />

        <Text style={styles.label}>Confirmar contraseña *</Text>
        <TextInput
          style={styles.input}
          placeholder="Repite tu contraseña"
          value={formData.password_confirmation}
          onChangeText={(value) => handleChange('password_confirmation', value)}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.registerButton, loading && { opacity: 0.7 }]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.registerButtonText}>Registrarse</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.noteText}>
          * Tu cuenta estará pendiente de activación por un administrador.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#114B5F',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 28,
    color: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 5,
  },
  helperText: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
    marginBottom: 8,
    marginLeft: 5,
  },
  registerButton: {
    backgroundColor: '#114B5F',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  noteText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    marginBottom: 40,
  },
});