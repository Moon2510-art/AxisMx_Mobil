import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/Ionicons';

export default function Notificaciones({ navigation }) {
  const [fontsLoaded] = useFonts({
    Ultra: require("../../assets/fonts/DelaGothicOne-Regular.ttf"),
  });

  // Estados para los interruptores
  const [config, setConfig] = useState({
    push: true,
    email: false,
    alertasSeguridad: true,
    nuevosAccesos: true,
    reportesSemanales: false,
  });

  const toggleSwitch = (campo) => setConfig({ ...config, [campo]: !config[campo] });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER ESTILO ULTRA */}
      <View style={styles.whiteHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="chevron-back" size={28} color="#114B5F" />
        </TouchableOpacity>
        <View>
          <Text style={styles.ultraTitle}>Alertas</Text>
          <Text style={styles.headerSubtitle}>Configura tus avisos</Text>
        </View>
        <View style={styles.iconContainer}>
          <Icon name="notifications-outline" size={24} color="#114B5F" />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.sectionLabel}>Canales de recepción</Text>
        <View style={styles.cardConfig}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Notificaciones Push</Text>
              <Text style={styles.settingDesc}>Recibir alertas en tiempo real</Text>
            </View>
            <Switch
              trackColor={{ false: "#D1D1D1", true: "#C8DFEA" }}
              thumbColor={config.push ? "#114B5F" : "#f4f3f4"}
              onValueChange={() => toggleSwitch('push')}
              value={config.push}
            />
          </View>
          
          <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Correo Electrónico</Text>
              <Text style={styles.settingDesc}>Resúmenes y alertas vía email</Text>
            </View>
            <Switch
              trackColor={{ false: "#D1D1D1", true: "#C8DFEA" }}
              thumbColor={config.email ? "#114B5F" : "#f4f3f4"}
              onValueChange={() => toggleSwitch('email')}
              value={config.email}
            />
          </View>
        </View>

        <Text style={styles.sectionLabel}>Eventos del Sistema</Text>
        <View style={styles.cardConfig}>
          <SettingItem 
            title="Seguridad Crítica" 
            desc="Intentos fallidos y bloqueos" 
            value={config.alertasSeguridad} 
            onToggle={() => toggleSwitch('alertasSeguridad')}
          />
          <SettingItem 
            title="Nuevos Accesos" 
            desc="Avisar cuando alguien ingrese" 
            value={config.nuevosAccesos} 
            onToggle={() => toggleSwitch('nuevosAccesos')}
          />
          <SettingItem 
            title="Reportes" 
            desc="Resumen semanal de actividad" 
            value={config.reportesSemanales} 
            onToggle={() => toggleSwitch('reportesSemanales')}
            last
          />
        </View>

        {/* HISTORIAL RECIENTE */}
        <Text style={styles.sectionLabel}>Historial Reciente</Text>
        <View style={styles.historyCard}>
          <View style={styles.historyItem}>
            <View style={[styles.dot, { backgroundColor: '#4CAF50' }]} />
            <View style={{flex: 1}}>
              <Text style={styles.historyText}>Acceso Peatonal: Juan Pérez</Text>
              <Text style={styles.historyTime}>Hoy, 10:45 AM</Text>
            </View>
          </View>
          <View style={[styles.historyItem, { borderBottomWidth: 0 }]}>
            <View style={[styles.dot, { backgroundColor: '#F44336' }]} />
            <View style={{flex: 1}}>
              <Text style={styles.historyText}>Intento denegado: Vehículo Desconocido</Text>
              <Text style={styles.historyTime}>Ayer, 18:20 PM</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// Componente auxiliar para las filas de configuración
const SettingItem = ({ title, desc, value, onToggle, last }) => (
  <View style={[styles.settingRow, last && { borderBottomWidth: 0 }]}>
    <View style={styles.settingInfo}>
      <Text style={styles.settingTitle}>{title}</Text>
      <Text style={styles.settingDesc}>{desc}</Text>
    </View>
    <Switch
      trackColor={{ false: "#D1D1D1", true: "#C8DFEA" }}
      thumbColor={value ? "#114B5F" : "#f4f3f4"}
      onValueChange={onToggle}
      value={value}
    />
  </View>
);

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
  ultraTitle: { fontSize: 24, color: '#114B5F', fontFamily: "Ultra" },
  headerSubtitle: { fontSize: 13, color: '#888', marginTop: -5 },
  iconContainer: { flex: 1, alignItems: 'flex-end' },
  
  scrollContent: { padding: 15, paddingBottom: 40 },
  sectionLabel: { fontSize: 14, fontWeight: 'bold', color: '#365563', marginBottom: 10, marginTop: 20, marginLeft: 5 },
  
  cardConfig: { backgroundColor: '#FFF', borderRadius: 18, paddingHorizontal: 15, elevation: 2 },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  settingInfo: { flex: 1 },
  settingTitle: { fontSize: 15, fontWeight: 'bold', color: '#114B5F' },
  settingDesc: { fontSize: 12, color: '#999', marginTop: 2 },
  
  historyCard: { backgroundColor: '#FFF', borderRadius: 18, padding: 15, elevation: 2 },
  historyItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  historyText: { fontSize: 14, color: '#333', fontWeight: '500' },
  historyTime: { fontSize: 11, color: '#AAA', marginTop: 2 },
});