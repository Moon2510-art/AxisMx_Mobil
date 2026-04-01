import React, { useState, useRef } from 'react';
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
import api, { ocrService } from '../services/api';

const { width } = Dimensions.get('window');

export default function ScannerScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    Ultra: require("../assets/fonts/DelaGothicOne-Regular.ttf"),
  });

  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState(null); // 'credential' o 'plate'
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  if (!fontsLoaded) return null;

  // Escaneo automático de códigos (QR/Barras) solo si es modo credencial
  const handleBarCodeScanned = async ({ data }) => {
    if (loading || mode !== 'credential') return;
    
    // Si detecta un QR, intentamos validarlo directamente
    setLoading(true);
    Vibration.vibrate(100);

    try {
      const response = await api.post('/verificar', { codigo_credencial: data });
      const autorizado = response.data.acceso_autorizado;
      Alert.alert(
        autorizado ? '✅ ACCESO EXITOSO' : '❌ ACCESO DENEGADO',
        response.data.mensaje || '',
        [{ text: 'ENTENDIDO', onPress: () => setScanning(false) }]
      );
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'No se pudo validar el código');
      setScanning(false);
    } finally {
      setLoading(false);
    }
  };

  // Capturar foto para OCR (Números de credencial o Placas)
  const takePictureAndOCR = async () => {
    if (!cameraRef.current || loading) return;
    setLoading(true);

    try {
      // Calidad balanceada para reducir el peso y evitar el Timeout de 10s
      const photo = await cameraRef.current.takePictureAsync({ 
        quality: 0.4,
        base64: false 
      });
      
      const ocrType = mode === 'plate' ? 'plate' : 'credential';
      const result = await ocrService.recognize(photo.uri, ocrType);
      
      if (!result.success) {
        throw new Error(result.message || 'No se detectó texto claro');
      }

      let endpoint = mode === 'plate' ? '/verificar-placa' : '/verificar';
      let payload = mode === 'plate' 
        ? { placa: result.placa } 
        : { codigo_credencial: result.codigo || result.id_number };

      const verifyResponse = await api.post(endpoint, payload);
      const autorizado = verifyResponse.data.acceso_autorizado;

      Alert.alert(
        autorizado ? '✅ ACCESO EXITOSO' : '❌ ACCESO DENEGADO',
        `${verifyResponse.data.mensaje || ''}\nLECTURA: ${payload.placa || payload.codigo_credencial}`,
        [{ text: 'ENTENDIDO', onPress: () => setScanning(false) }]
      );
    } catch (error) {
      console.error('Error en proceso:', error);
      Alert.alert('Lectura Fallida', error.message || 'Asegúrate de tener buena luz y enfocar bien.');
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

  // PANTALLA DE SELECCIÓN DE MODO
  if (!scanning) {
    return (
      <SafeAreaView style={styles.contenedor}>
        <View style={styles.encabezadoBlanco}>
          <Text style={styles.textoTitulo}>SELECCIONAR ACCESO</Text>
        </View>

        <View style={styles.content}>
          <TouchableOpacity
            style={styles.botonModo}
            onPress={() => { setMode('credential'); setScanning(true); }}
          >
            <Icon name="person-card-outline" size={50} color="#365563" />
            <Text style={styles.textoModo}>IDENTIFICACIÓN</Text>
            <Text style={styles.textoModoSmall}>Escanea el número o el código QR</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botonModo, styles.botonPlaca]}
            onPress={() => { setMode('plate'); setScanning(true); }}
          >
            <Icon name="car-sport-outline" size={50} color="#365563" />
            <Text style={styles.textoModo}>PLACA VEHICULAR</Text>
            <Text style={styles.textoModoSmall}>Captura automática de placa (OCR)</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // PANTALLA DE CÁMARA ACTIVA
  return (
    <SafeAreaView style={styles.contenedor}>
      <View style={styles.encabezadoBlanco}>
        <Text style={styles.textoTitulo}>
          {mode === 'credential' ? 'ID / CREDENCIAL' : 'PLACA'}
        </Text>
        <TouchableOpacity onPress={() => setScanning(false)}>
          <Icon name="close-circle" size={32} color="#FF0000" />
        </TouchableOpacity>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFillObject}
          facing="back"
          barcodeScannerSettings={
            mode === 'credential' ? { barcodeTypes: ['qr', 'pdf417'] } : undefined
          }
          onBarcodeScanned={mode === 'credential' ? handleBarCodeScanned : undefined}
        />
        
        {/* OVERLAY DINÁMICO */}
        <View style={styles.overlay}>
          <View style={styles.unfocusedContainer} />
          
          <View style={styles.middleRow}>
            <View style={styles.unfocusedContainer} />
            
            {/* AREA DE ENFOQUE: Se ajusta según el modo */}
            <View style={[
                styles.focusedContainer, 
                mode === 'plate' || mode === 'credential' ? styles.focusHorizontal : styles.focusSquare
            ]}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              {loading && <ActivityIndicator size="large" color="#FF9800" style={styles.loader} />}
            </View>
            
            <View style={styles.unfocusedContainer} />
          </View>
          
          <View style={styles.bottomControls}>
            <Text style={styles.textoOverlay}>
              {mode === 'credential'
                ? 'ENFOCA EL NÚMERO DE IDENTIFICACIÓN O EL QR'
                : 'ENFOCA LA PLACA Y PRESIONA CAPTURAR'}
            </Text>
            
            <TouchableOpacity 
                style={[styles.botonCaptura, loading && { opacity: 0.6 }]} 
                onPress={takePictureAndOCR} 
                disabled={loading}
            >
              <Icon name="camera" size={24} color="#FFF" style={{marginRight: 10}} />
              <Text style={styles.textoBotonCaptura}>
                {loading ? 'PROCESANDO...' : 'TOMAR CAPTURA'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botonVolver} onPress={() => setScanning(false)}>
              <Text style={styles.textoVolver}>CAMBIAR MODO</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#C8DFEA' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#C8DFEA' },

  encabezadoBlanco: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 15,
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#365563',
  },
  textoTitulo: { fontSize: 16, color: '#365563', fontFamily: 'Ultra', flex: 1 },

  content: { flex: 1, alignItems: 'center', paddingHorizontal: 20, justifyContent: 'center' },
  botonModo: {
    backgroundColor: '#FFF',
    width: '100%',
    padding: 25,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#365563',
    alignItems: 'center',
    marginBottom: 25,
    elevation: 5,
  },
  botonPlaca: { borderColor: '#365563' },
  textoModo: { fontFamily: 'Ultra', color: '#365563', fontSize: 18, marginTop: 10 },
  textoModoSmall: { fontFamily: 'Ultra', color: '#607D8B', fontSize: 11, marginTop: 5 },

  cameraContainer: {
    flex: 1,
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#FFF',
  },
  overlay: { flex: 1 },
  unfocusedContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  
  middleRow: { flexDirection: 'row', alignItems: 'center' },
  
  focusedContainer: { 
    borderWidth: 0,
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  focusHorizontal: { width: width * 0.75, height: 160 }, // Para placas y credenciales
  focusSquare: { width: width * 0.7, height: width * 0.7 }, // Para QR puro
  
  corner: { position: 'absolute', width: 30, height: 30, borderColor: '#00FF00', borderWidth: 4 },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  
  bottomControls: { 
    flex: 1.2, 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    alignItems: 'center', 
    paddingTop: 20 
  },
  textoOverlay: { 
    color: '#FFF', 
    fontFamily: 'Ultra', 
    fontSize: 12, 
    marginBottom: 20, 
    textAlign: 'center', 
    paddingHorizontal: 30 
  },
  botonCaptura: {
    flexDirection: 'row',
    backgroundColor: '#365563',
    paddingVertical: 15,
    paddingHorizontal: 35,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#FFF',
    alignItems: 'center',
    elevation: 10,
  },
  textoBotonCaptura: { color: '#FFF', fontFamily: 'Ultra', fontSize: 14 },
  botonVolver: { marginTop: 20 },
  textoVolver: { color: '#AAA', fontFamily: 'Ultra', fontSize: 12, textDecorationLine: 'underline' },
  
  loader: { backgroundColor: 'rgba(0,0,0,0.5)', padding: 20, borderRadius: 15 },
  botonPrincipal: { backgroundColor: '#365563', padding: 15, borderRadius: 10, marginTop: 20 },
  textoPermiso: { fontFamily: 'Ultra', color: '#365563', marginTop: 20 },
});