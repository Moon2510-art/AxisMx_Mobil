 import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Vibration,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/Ionicons';
import api from '../services/api';

const { width } = Dimensions.get('window');

export default function ScannerScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    Ultra: require("../assets/fonts/DelaGothicOne-Regular.ttf"),
  });

  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  if (!fontsLoaded) return null;

  const handleBarCodeScanned = async ({ data }) => {
    if (loading) return;
    setLoading(true);
    Vibration.vibrate(100);

    try {
      // Ajustamos al endpoint de tu servicio
      const response = await api.post('/verificar', { codigo_credencial: data });
      
      const esAutorizado = response.data.acceso_autorizado;
      
      Alert.alert(
        esAutorizado ? '✅ ACCESO EXITOSO' : '❌ ACCESO DENEGADO',
        `${response.data.mensaje || ''}`,
        [{ text: 'ENTENDIDO', onPress: () => setScanning(false) }]
      );
    } catch (error) {
      Alert.alert('Error de Red', 'No se pudo validar con el servidor.');
      setScanning(false);
    } finally {
      setLoading(false);
    }
  };

  if (!permission) return <View style={styles.centerContainer} />;
  
  if (!permission.granted) {
    return (
      <View style={styles.centerContainer}>
        <Icon name="lock-closed" size={80} color="#365563" />
        <Text style={styles.textoPermiso}>Se requiere acceso a la cámara</Text>
        <TouchableOpacity style={styles.botonPrincipal} onPress={requestPermission}>
          <Text style={styles.textoBoton}>CONCEDER PERMISO</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.contenedor}>
      {/* Encabezado igual a tu pantalla de Usuarios */}
      <View style={styles.encabezadoBlanco}>
        <Text style={styles.textoTitulo}>ESCANER</Text>
        <View style={styles.badgePerfil}>
          <Icon name="shield-checkmark" size={18} color="#365563" style={{marginRight: 5}}/>
          <Text style={styles.nombrePerfil}>Seguridad</Text>
        </View>
      </View>

      {!scanning ? (
        <View style={styles.content}>
          <View style={styles.tarjetaInfo}>
            <Text style={styles.infoTitulo}>INSTRUCCIONES</Text>
            <Text style={styles.infoSub}>1. Selecciona el modo de escaneo.</Text>
            <Text style={styles.infoSub}>2. Centra el código o la placa en el recuadro.</Text>
            <Text style={styles.infoSub}>3. El sistema validará automáticamente.</Text>
          </View>

          <TouchableOpacity 
            style={styles.botonGrandeEscaneo} 
            onPress={() => setScanning(true)}
          >
            <Icon name="scan-circle" size={100} color="#365563" />
            <Text style={styles.textoBotonGrande}>INICIAR LECTURA</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.cameraContainer}>
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ['qr', 'code128', 'code39'],
            }}
            onBarcodeScanned={loading ? undefined : handleBarCodeScanned}
          >
            {/* Overlay Profesional */}
            <View style={styles.overlay}>
              <View style={styles.unfocusedContainer}></View>
              <View style={styles.middleContainer}>
                <View style={styles.unfocusedContainer}></View>
                <View style={styles.focusedContainer}>
                  {/* Esquinas del escáner */}
                  <View style={[styles.corner, styles.topLeft]} />
                  <View style={[styles.corner, styles.topRight]} />
                  <View style={[styles.corner, styles.bottomLeft]} />
                  <View style={[styles.corner, styles.bottomRight]} />
                  {loading && <ActivityIndicator size="large" color="#FFF" />}
                </View>
                <View style={styles.unfocusedContainer}></View>
              </View>
              <View style={styles.unfocusedContainer}>
                <Text style={styles.textoOverlay}>CENTRA LA CREDENCIAL O PLACA</Text>
                <TouchableOpacity 
                  style={styles.botonCancelar} 
                  onPress={() => setScanning(false)}
                >
                  <Text style={styles.textoBoton}>CANCELAR</Text>
                </TouchableOpacity>
              </View>
            </View>
          </CameraView>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#C8DFEA' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#C8DFEA' },
  
  encabezadoBlanco: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 15,
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#365563'
  },
  textoTitulo: { fontSize: 28, color: '#365563', fontFamily: "Ultra" },
  badgePerfil: { flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 12, borderWidth: 1, borderColor: '#365563' },
  nombrePerfil: { color: '#365563', fontSize: 14, fontFamily: "Ultra" },

  content: { flex: 1, alignItems: 'center', paddingHorizontal: 20 },
  
  tarjetaInfo: {
    backgroundColor: '#FFF',
    width: '100%',
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#365563',
    marginBottom: 40
  },
  infoTitulo: { fontFamily: 'Ultra', color: '#365563', fontSize: 18, marginBottom: 10 },
  infoSub: { color: '#365563', fontSize: 14, marginBottom: 5 },

  botonGrandeEscaneo: {
    backgroundColor: '#FFF',
    width: 220,
    height: 220,
    borderRadius: 110,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#365563',
    elevation: 5,
  },
  textoBotonGrande: { fontFamily: 'Ultra', color: '#365563', marginTop: 10, fontSize: 16 },

  cameraContainer: { flex: 1, marginHorizontal: 15, marginBottom: 15, borderRadius: 20, overflow: 'hidden', borderWidth: 3, borderColor: '#FFF' },
  
  // Estilos del Overlay
  overlay: { flex: 1 },
  unfocusedContainer: { flex: 1, backgroundColor: 'rgba(54, 85, 99, 0.7)', justifyContent: 'center', alignItems: 'center' },
  middleContainer: { flexDirection: 'row', height: 280 },
  focusedContainer: { width: 280, justifyContent: 'center', alignItems: 'center' },
  
  // Esquinas decorativas
  corner: { position: 'absolute', width: 40, height: 40, borderColor: '#FFF', borderWidth: 5 },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },

  textoOverlay: { color: '#FFF', fontFamily: 'Ultra', fontSize: 14, marginBottom: 20, textAlign: 'center' },
  botonCancelar: { backgroundColor: '#FF0000', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 15, borderWidth: 2, borderColor: '#FFF' },
  textoBoton: { color: '#FFF', fontFamily: 'Ultra', fontSize: 14 },
  botonPrincipal: { backgroundColor: '#365563', padding: 15, borderRadius: 10, marginTop: 20 },
  textoPermiso: { fontFamily: 'Ultra', color: '#365563', marginTop: 20 }
});