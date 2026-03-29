import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ScannerScreen() {
  const [scanType, setScanType] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScanCredential = () => {
    Alert.alert(
      'Escanear Credencial',
      'Simulación: Aquí se abriría la cámara para escanear la credencial',
      [{ text: 'OK' }]
    );
  };

  const handleScanPlate = () => {
    Alert.alert(
      'Escanear Placa',
      'Simulación: Aquí se abriría la cámara para escanear la placa',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Escáner de Accesos</Text>
        <Text style={styles.subtitle}>
          Selecciona el tipo de acceso que deseas registrar
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[styles.scanButton, styles.credentialButton]}
          onPress={handleScanCredential}
        >
          <Icon name="qr-code-outline" size={60} color="#fff" />
          <Text style={styles.scanButtonText}>Escanear Credencial</Text>
          <Text style={styles.scanButtonSubtext}>
            Escanea el código de la credencial
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.scanButton, styles.plateButton]}
          onPress={handleScanPlate}
        >
          <Icon name="car-outline" size={60} color="#fff" />
          <Text style={styles.scanButtonText}>Escanear Placa</Text>
          <Text style={styles.scanButtonSubtext}>
            Escanea la placa del vehículo
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Últimos accesos</Text>
        <Text style={styles.infoText}>Sin accesos recientes</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#114B5F',
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#C8DFEA',
    textAlign: 'center',
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 20,
  },
  scanButton: {
    width: '100%',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  credentialButton: {
    backgroundColor: '#4CAF50',
  },
  plateButton: {
    backgroundColor: '#FF9800',
  },
  scanButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  scanButtonSubtext: {
    fontSize: 12,
    color: '#fff',
    marginTop: 5,
  },
  infoContainer: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 15,
    borderRadius: 15,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#114B5F',
    marginBottom: 10,
  },
  infoText: {
    color: '#666',
  },
});