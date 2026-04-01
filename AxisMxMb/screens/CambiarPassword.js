import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CambiarPassword({ navigation }) {
  const { user } = useAuth();

  const [form, setForm] = useState({
    actual: '',
    nueva: '',
    confirmar: ''
  });
  const [loading, setLoading] = useState(false);
  const [showActual, setShowActual] = useState(true);
  const [showNueva, setShowNueva] = useState(true);
  const [showConfirmar, setShowConfirmar] = useState(true);

  const handleUpdate = async () => {
    if (!form.actual || !form.nueva || !form.confirmar) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    if (form.nueva.length < 6) {
      Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (form.nueva !== form.confirmar) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.changePassword(user?.ID_Usuario || user?.id, {
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
      Alert.alert('Error', 'Hubo un problema con la conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Seguridad</Text>
          
          {/* Contraseña Actual */}
          <View style={styles.menuItem}>
            <Icon name="lock-closed-outline" size={24} color="#114B5F" />
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemText}>Contraseña actual</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Ingresa tu contraseña actual"
                  placeholderTextColor="#999"
                  secureTextEntry={showActual}
                  value={form.actual}
                  onChangeText={(t) => setForm({...form, actual: t})}
                />
                <TouchableOpacity onPress={() => setShowActual(!showActual)}>
                  <Icon name={showActual ? "eye-outline" : "eye-off-outline"} size={20} color="#999" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Nueva Contraseña */}
          <View style={styles.menuItem}>
            <Icon name="key-outline" size={24} color="#114B5F" />
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemText}>Nueva contraseña</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor="#999"
                  secureTextEntry={showNueva}
                  value={form.nueva}
                  onChangeText={(t) => setForm({...form, nueva: t})}
                />
                <TouchableOpacity onPress={() => setShowNueva(!showNueva)}>
                  <Icon name={showNueva ? "eye-outline" : "eye-off-outline"} size={20} color="#999" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Confirmar Contraseña */}
          <View style={[styles.menuItem, { borderBottomWidth: 0 }]}>
            <Icon name="checkmark-circle-outline" size={24} color="#114B5F" />
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemText}>Confirmar contraseña</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Repite la nueva contraseña"
                  placeholderTextColor="#999"
                  secureTextEntry={showConfirmar}
                  value={form.confirmar}
                  onChangeText={(t) => setForm({...form, confirmar: t})}
                />
                <TouchableOpacity onPress={() => setShowConfirmar(!showConfirmar)}>
                  <Icon name={showConfirmar ? "eye-outline" : "eye-off-outline"} size={20} color="#999" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Botón Guardar */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.saveButton, loading && { opacity: 0.7 }]} 
            onPress={handleUpdate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.saveButtonText}>Actualizar contraseña</Text>
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
  scrollContent: {
    paddingBottom: 30,
  },
  sectionContainer: {
    backgroundColor: '#fff',
    marginTop: 15,
    paddingVertical: 5,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    paddingHorizontal: 20,
    paddingVertical: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemContent: {
    flex: 1,
    marginLeft: 15,
    marginRight: 10,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    paddingVertical: 10,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#114B5F',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});