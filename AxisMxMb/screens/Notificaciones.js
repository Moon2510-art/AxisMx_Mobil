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
import Icon from 'react-native-vector-icons/Ionicons';

export default function Notificaciones({ navigation }) {
  // Estados para los interruptores
  const [config, setConfig] = useState({
    push: true,
    email: false,
    alertasSeguridad: true,
    nuevosAccesos: true,
    reportesSemanales: false,
  });

  const toggleSwitch = (campo) => setConfig({ ...config, [campo]: !config[campo] });

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER SIMPLE ESTILO APP */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificaciones</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Canales de recepción</Text>
          
          <View style={styles.menuItem}>
            <Icon name="notifications-outline" size={24} color="#114B5F" />
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemText}>Notificaciones Push</Text>
              <Text style={styles.menuItemDescription}>Alertas en tiempo real en tu móvil</Text>
            </View>
            <Switch
              trackColor={{ false: "#D1D1D1", true: "#C8DFEA" }}
              thumbColor={config.push ? "#114B5F" : "#f4f3f4"}
              onValueChange={() => toggleSwitch('push')}
              value={config.push}
            />
          </View>

          <View style={[styles.menuItem, { borderBottomWidth: 0 }]}>
            <Icon name="mail-outline" size={24} color="#114B5F" />
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemText}>Correo Electrónico</Text>
              <Text style={styles.menuItemDescription}>Resúmenes y avisos vía email</Text>
            </View>
            <Switch
              trackColor={{ false: "#D1D1D1", true: "#C8DFEA" }}
              thumbColor={config.email ? "#114B5F" : "#f4f3f4"}
              onValueChange={() => toggleSwitch('email')}
              value={config.email}
            />
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Eventos del Sistema</Text>
          
          <ConfigItem 
            icon="shield-checkmark-outline"
            label="Seguridad Crítica"
            desc="Intentos fallidos y bloqueos"
            value={config.alertasSeguridad}
            onToggle={() => toggleSwitch('alertasSeguridad')}
          />

          <ConfigItem 
            icon="log-in-outline"
            label="Nuevos Accesos"
            desc="Avisar cuando se registre un ingreso"
            value={config.nuevosAccesos}
            onToggle={() => toggleSwitch('nuevosAccesos')}
          />

          <ConfigItem 
            icon="bar-chart-outline"
            label="Reportes Semanales"
            desc="Resumen de actividad de la semana"
            value={config.reportesSemanales}
            onToggle={() => toggleSwitch('reportesSemanales')}
            isLast
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Los cambios se guardan automáticamente</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// Componente auxiliar para mantener el estilo de Perfil
const ConfigItem = ({ icon, label, desc, value, onToggle, isLast }) => (
  <View style={[styles.menuItem, isLast && { borderBottomWidth: 0 }]}>
    <Icon name={icon} size={24} color="#114B5F" />
    <View style={styles.menuItemContent}>
      <Text style={styles.menuItemText}>{label}</Text>
      <Text style={styles.menuItemDescription}>{desc}</Text>
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
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#114B5F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  backBtn: {
    padding: 5,
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
    alignItems: 'center',
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
  },
  menuItemDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  footerText: {
    fontSize: 12,
    color: '#bbb',
  },
});