import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';

export default function Usuarios() {
  const [selectedFilter, setSelectedFilter] = useState('todos');
  
  const users = [
    { id: '1234', name: 'Juan Pérez', type: 'Empleado', department: 'Ventas', status: 'Dentro', image: '👨' },
    { id: '5678', name: 'María García', type: 'Empleado', department: 'RRHH', status: 'Fuera', image: '👩' },
    { id: '9012', name: 'Carlos López', type: 'Visitante', department: 'Proveedor', status: 'Dentro', image: '👨' },
    { id: '3456', name: 'Ana Martínez', type: 'Empleado', department: 'IT', status: 'Dentro', image: '👩' },
    { id: '7890', name: 'Roberto Sánchez', type: 'Empleado', department: 'Operaciones', status: 'Fuera', image: '👨' },
    { id: '2345', name: 'Laura Torres', type: 'Visitante', department: 'Cliente', status: 'Fuera', image: '👩' },
    { id: '6789', name: 'Miguel Ángel', type: 'Empleado', department: 'Mantenimiento', status: 'Dentro', image: '👨' },
  ];

  const filters = ['todos', 'empleados', 'visitantes', 'dentro', 'fuera'];

  const getStatusColor = (status) => {
    return status === 'Dentro' ? '#2ecc71' : '#e74c3c';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Usuarios</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Nuevo</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar usuarios..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              selectedFilter === filter && styles.filterChipActive
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text style={[
              styles.filterChipText,
              selectedFilter === filter && styles.filterChipTextActive
            ]}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Users List */}
      <ScrollView style={styles.content}>
        <Text style={styles.listTitle}>Lista de Usuarios ({users.length})</Text>
        
        {users.map((user, index) => (
          <TouchableOpacity key={index} style={styles.userCard}>
            <View style={styles.userImage}>
              <Text style={styles.userImageText}>{user.image}</Text>
            </View>
            
            <View style={styles.userInfo}>
              <View style={styles.userHeader}>
                <Text style={styles.userName}>{user.name}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(user.status) + '20' }]}>
                  <View style={[styles.statusDot, { backgroundColor: getStatusColor(user.status) }]} />
                  <Text style={[styles.statusText, { color: getStatusColor(user.status) }]}>{user.status}</Text>
                </View>
              </View>
              
              <View style={styles.userDetails}>
                <Text style={styles.userType}>{user.type}</Text>
                <Text style={styles.userDepartment}>{user.department}</Text>
              </View>
              
              <Text style={styles.userId}>ID: {user.id}</Text>
            </View>
            
            <TouchableOpacity style={styles.moreButton}>
              <Text style={styles.moreButtonText}>⋯</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2c3e50',
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  addButton: {
    backgroundColor: '#34495e',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginRight: 10,
  },
  filterButton: {
    backgroundColor: '#0477bf',
    padding: 12,
    borderRadius: 10,
    justifyContent: 'center',
  },
  filterButtonText: {
    fontSize: 20,
  },
  filtersContainer: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  filterChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 5,
  },
  filterChipActive: {
    backgroundColor: '#0477bf',
  },
  filterChipText: {
    color: '#7f8c8d',
    fontSize: 14,
  },
  filterChipTextActive: {
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
  },
  userCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userImageText: {
    fontSize: 24,
  },
  userInfo: {
    flex: 1,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
  },
  userDetails: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  userType: {
    fontSize: 13,
    color: '#7f8c8d',
    marginRight: 10,
  },
  userDepartment: {
    fontSize: 13,
    color: '#7f8c8d',
  },
  userId: {
    fontSize: 12,
    color: '#95a5a6',
  },
  moreButton: {
    padding: 10,
  },
  moreButtonText: {
    fontSize: 20,
    color: '#7f8c8d',
  },
});