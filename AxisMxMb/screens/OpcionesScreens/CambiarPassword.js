import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/Ionicons';
import { usuarioService } from '../../services/api'; // Asegúrate de que tu api.js tenga el método update
import { useAuth } from '../../context/AuthContext';

export default function CambiarPassword({ navigation }) {
  const { user } = useAuth();
  const [fontsLoaded] = useFonts({
    Ultra: require("../../assets/fonts/DelaGothicOne-Regular.ttf"),
  });

  const [form, setForm] = useState({
    actual: '',
    nueva: '',
    confirmar: ''
  });
  const [loading, setLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);

  const handleUpdate = async () => {
    // Validaciones básicas
    if (!form.actual || !form.nueva || !form.confirmar) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    if (form.nueva.length < 6) {
      Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (form.nueva !== form.confirmar) {
      Alert.alert('Error', 'La nueva contraseña y la confirmación no coinciden.');
      return;
    }

    setLoading(true);
    try {
      // Nota: Aquí llamamos al servicio. El backend debe validar la "actual"
      const result = await usuarioService.updatePassword(user.id_usuario, {
        passwordActual: form.actual,
        nuevaPassword: form.nueva
      });

      if (result.success) {
        Alert.alert('Éxito', 'Contraseña actualizada correctamente', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Error', result.message || 'No se pudo actualizar la contraseña');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema con la conexión al servidor.');
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* HEADER ESTILO ULTRA */}
        <View style={styles.whiteHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="chevron-back" size={28} color="#114B5F" />
          </TouchableOpacity>
          <View>
            <Text style={styles.ultraTitle}>Seguridad</Text>
            <Text style={styles.headerSubtitle}>Actualizar credenciales</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.infoBox}>
            <Icon name="shield-checkmark-outline" size={40} color="#114B5F" />
            <Text style={styles.infoText}>
              Tu nueva contraseña debe ser distinta a la anterior para garantizar la seguridad de tu cuenta.
            </Text>
          </View>

          <View style={styles.formCard}>
            {/* Password Actual */}
            <Text style={styles.label}>Contraseña Actual</Text>
            <View style={styles.inputContainer}>
              <Icon name="lock-closed-outline" size={20} color="#365563" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu contraseña actual"
                secureTextEntry={secureText}
                value={form.actual}
                onChangeText={(t) => setForm({...form, actual: t})}
              />
            </View>

            {/* Password Nueva */}
            <Text style={styles.label}>Nueva Contraseña</Text>
            <View style={styles.inputContainer}>
              <Icon name="key-outline" size={20} color="#365563" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Mínimo 6 caracteres"
                secureTextEntry={secureText}
                value={form.nueva}
                onChangeText={(t) => setForm({...form, nueva: t})}
              />
              <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                <Icon name={secureText ? "eye-outline" : "eye-off-outline"} size={20} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Confirmar Password */}
            <Text style={styles.label}>Confirmar Nueva Contraseña</Text>
            <View style={styles.inputContainer}>
              <Icon name="checkmark-circle-outline" size={20} color="#365563" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Repite la nueva contraseña"
                secureTextEntry={secureText}
                value={form.confirmar}
                onChangeText={(t) => setForm({...form, confirmar: t})}
              />
            </View>

            <TouchableOpacity 
              style={[styles.btnGuardar, loading && { opacity: 0.7 }]} 
              onPress={handleUpdate}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.btnText}>Actualizar Contraseña</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#C8DFEA' },
  whiteHeader: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    marginHorizontal: 15,
    marginTop: 15,
    elevation: 5,
  },
  backBtn: { marginRight: 15 },
  ultraTitle: { fontSize: 22, color: '#114B5F', fontFamily: "Ultra" },
  headerSubtitle: { fontSize: 13, color: '#888', marginTop: -5 },
  
  scrollContent: { padding: 20 },
  infoBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF', 
    padding: 15, 
    borderRadius: 15, 
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#114B5F'
  },
  infoText: { flex: 1, marginLeft: 15, fontSize: 12, color: '#365563', lineHeight: 18 },
  
  formCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, elevation: 3 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#114B5F', marginBottom: 8, marginLeft: 5 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F8FA',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E1E8ED'
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 50, color: '#333' },
  
  btnGuardar: {
    backgroundColor: '#114B5F',
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 4,
  },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});