import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { useFocusEffect } from '@react-navigation/native';
import { visitanteService } from '../../services/api';

export default function Visitantes() {
  const [fontsLoaded] = useFonts({
    Ultra: require("../../assets/fonts/DelaGothicOne-Regular.ttf"),
  });

  const [visitantes, setVisitantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargarVisitantes = async () => {
    const result = await visitanteService.getAll();
    if (result.success) {
      setVisitantes(result.data);
    } else {
      Alert.alert('Error', result.message);
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await cargarVisitantes();
    setRefreshing(false);
  };

  const handleToggleEstado = async (visitante) => {
    const estadoActual = Number(visitante.ID_Estado);
    const nuevoEstado = estadoActual === 1 ? 2 : 1;
    const estadoTexto = nuevoEstado === 1 ? 'activar' : 'desactivar';
    
    Alert.alert(
      'Confirmar Cambio',
      `¿Deseas ${estadoTexto} el acceso para ${visitante.Nombre}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aceptar',
          onPress: async () => {
            // Optimistic UI Update (Feedback instantáneo)
            setVisitantes(prev => prev.map(v => 
              v.ID_Usuario === visitante.ID_Usuario ? { ...v, ID_Estado: nuevoEstado } : v
            ));
            
            const result = await visitanteService.update(visitante.ID_Usuario, {
              ID_Estado: nuevoEstado
            });
            
            if (!result.success) {
              setVisitantes(prev => prev.map(v => 
                v.ID_Usuario === visitante.ID_Usuario ? { ...v, ID_Estado: estadoActual } : v
              ));
              Alert.alert('Error', result.message);
            }
          }
        }
      ]
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      cargarVisitantes();
    }, [])
  );

  const getInitials = (nombre, apellido) => {
    return `${nombre?.charAt(0) || ''}${apellido?.charAt(0) || ''}`.toUpperCase();
  };

  if (!fontsLoaded) return null;

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#114B5F" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* HEADER ESTILO ULTRA */}
      <View style={styles.whiteHeader}>
        <View>
          <Text style={styles.ultraTitle}>Visitantes</Text>
          <Text style={styles.headerSubtitle}>Gestión de temporales</Text>
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{visitantes.length}</Text>
        </View>
      </View>

      <FlatList
        data={visitantes}
        keyExtractor={(item) => item.ID_Usuario.toString()}
        renderItem={({ item }) => (
          <View style={styles.visitorCard}>
            <View style={styles.topSection}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarTxt}>{getInitials(item.Nombre, item.Ap_Paterno)}</Text>
              </View>
              <View style={styles.mainInfo}>
                <Text style={styles.visitorName} numberOfLines={1}>
                  {item.Nombre} {item.Ap_Paterno}
                </Text>
                <View style={[styles.statusBadge, Number(item.ID_Estado) === 1 ? styles.bgActivo : styles.bgInactivo]}>
                  <Text style={styles.statusText}>
                    {Number(item.ID_Estado) === 1 ? 'ACTIVO' : 'INACTIVO'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.detailsDivider} />

            <View style={styles.bottomSection}>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>📧 {item.Email}</Text>
                <Text style={styles.contactLabel}>📞 {item.Telefono || 'Sin registro'}</Text>
              </View>
              
              <TouchableOpacity 
                style={[styles.actionBtn, Number(item.ID_Estado) === 1 ? styles.btnDanger : styles.btnSuccess]}
                onPress={() => handleToggleEstado(item)}
              >
                <Text style={styles.actionBtnTxt}>
                  {Number(item.ID_Estado) === 1 ? 'Suspender' : 'Habilitar'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.dateLabel}>
              Registrado: {new Date(item.Fecha_Creacion).toLocaleDateString()}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.listPadding}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#114B5F']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTxt}>Sin visitantes en la lista</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#C8DFEA' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // Header
  whiteHeader: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  ultraTitle: { fontSize: 26, color: '#365563', fontFamily: "Ultra" },
  headerSubtitle: { fontSize: 13, color: '#888', marginTop: -5 },
  countBadge: { backgroundColor: '#114B5F', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
  countText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },

  listPadding: { paddingHorizontal: 15, paddingBottom: 30 },
  
  // Card
  visitorCard: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
  },
  topSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F4F7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C8DFEA'
  },
  avatarTxt: { fontSize: 18, fontWeight: 'bold', color: '#114B5F' },
  mainInfo: { marginLeft: 15, flex: 1 },
  visitorName: { fontSize: 17, fontWeight: 'bold', color: '#114B5F' },
  
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginTop: 4 },
  bgActivo: { backgroundColor: '#E8F5E9' },
  bgInactivo: { backgroundColor: '#FFEBEE' },
  statusText: { fontSize: 10, fontWeight: '800', color: '#333' },

  detailsDivider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 10 },
  
  bottomSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  contactInfo: { flex: 1 },
  contactLabel: { fontSize: 12, color: '#666', marginBottom: 2 },
  
  actionBtn: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10 },
  btnSuccess: { backgroundColor: '#4CAF50' },
  btnDanger: { backgroundColor: '#F44336' },
  actionBtnTxt: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  
  dateLabel: { fontSize: 10, color: '#AAA', marginTop: 10, textAlign: 'right', fontStyle: 'italic' },

  emptyBox: { alignItems: 'center', marginTop: 60 },
  emptyTxt: { color: '#114B5F', opacity: 0.5, fontSize: 16 }
});