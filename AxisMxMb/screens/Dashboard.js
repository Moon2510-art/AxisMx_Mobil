import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AXISMX</Text>
      </View>

      {/* Stats Cards */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, styles.statCardBlue]}>
            <Text style={styles.statNumber}>156</Text>
            <Text style={styles.statLabel}>Ingresos Hoy</Text>
          </View>
          <View style={[styles.statCard, styles.statCardGreen]}>
            <Text style={styles.statNumber}>42</Text>
            <Text style={styles.statLabel}>Dentro</Text>
          </View>
          <View style={[styles.statCard, styles.statCardOrange]}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Visitantes</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre o ID..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Buscar</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>➕</Text>
            <Text style={styles.actionText}>Registrar Entrada</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>🚪</Text>
            <Text style={styles.actionText}>Registrar Salida</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>👤</Text>
            <Text style={styles.actionText}>Nuevo Usuario</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>Actividad Reciente</Text>
        
        <View style={styles.activityItem}>
          <View style={[styles.activityIndicator, styles.entryIndicator]} />
          <View style={styles.activityInfo}>
            <Text style={styles.activityName}>Cristobal Eduardo Cervantes Santana</Text>
            <Text style={styles.activityTime}>08:45 AM - Entrada</Text>
          </View>
          <Text style={styles.activityID}>ID: 1234</Text>
        </View>


        <View style={styles.activityItem}>
          <View style={[styles.activityIndicator, styles.visitorIndicator]} />
          <View style={styles.activityInfo}>
            <Text style={styles.activityName}>Isaac Lopez Madrigal</Text>
            <Text style={styles.activityTime}>02:15 PM - Visitante</Text>
          </View>
          <Text style={styles.activityID}>ID: 9012</Text>
        </View>

        <View style={styles.activityItem}>
          <View style={[styles.activityIndicator, styles.entryIndicator]} />
          <View style={styles.activityInfo}>
            <Text style={styles.activityName}>Valentina Jimenez Perez</Text>
            <Text style={styles.activityTime}>09:20 AM - Entrada</Text>
          </View>
          <Text style={styles.activityID}>ID: 3456</Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navText}>Inicio</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>📋</Text>
          <Text style={styles.navText}>Registros</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.navItem, styles.navCenter]}>
          <Text style={styles.navCenterIcon}>📷</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>👥</Text>
          <Text style={styles.navText}>Usuarios</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={styles.navText}>Ajustes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#0477BF',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  statCardBlue: {
    backgroundColor: '#3498db',
  },
  statCardGreen: {
    backgroundColor: '#0be164',
  },
  statCardOrange: {
    backgroundColor: '#e67e22',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: 'white',
    marginTop: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginRight: 10,
    shadowColor: '#0477AF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchButton: {
    backgroundColor: '#0477AF',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  actionText: {
    fontSize: 12,
    color: '#2c3e50',
    textAlign: 'center',
  },
  activityItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  entryIndicator: {
    backgroundColor: '#2ecc71',
  },
  exitIndicator: {
    backgroundColor: '#e74c3c',
  },
  visitorIndicator: {
    backgroundColor: '#f39c12',
  },
  activityInfo: {
    flex: 1,
  },
  activityName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  activityTime: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  activityID: {
    fontSize: 12,
    color: '#95a5a6',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navCenter: {
    marginTop: -20,
  },
  navIcon: {
    fontSize: 20,
  },
  navCenterIcon: {
    fontSize: 30,
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: 10,
    borderRadius: 30,
    overflow: 'hidden',
  },
  navText: {
    fontSize: 11,
    color: '#7f8c8d',
    marginTop: 2,
  },
});