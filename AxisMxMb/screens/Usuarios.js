import {
  Text,
  StyleSheet,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image
} from "react-native";
import React from "react";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

export default function Usuarios() {
  // Datos de ejemplo para la lista
  const usuarios = [
    {
      id: "1",
      nombre: "Cervantes Santana Cristobal Eduardo",
      status: "#8ec444",
    },
    {
      id: "2",
      nombre: "Cervantes Santana Cristobal Eduardo",
      status: "#8ec444",
    },
    {
      id: "3",
      nombre: "Cervantes Santana Cristobal Eduardo",
      status: "#8ec444",
    },
    {
      id: "4",
      nombre: "Cervantes Santana Cristobal Eduardo",
      status: "#8ec444",
    },
    {
      id: "5",
      nombre: "Cervantes Santana Cristobal Eduardo",
      status: "#8ec444",
    },
  ];

  return (
    <View style={styles.mainContainer}>
      {/* Header Oscuro */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>AxisMx</Text>
          <Text style={styles.headerSubtitle}>Bienvenido: Cristobal</Text>
        </View>

        <View style={styles.logoContainer}>
          <Image source={require("../assets/logo2.png")} style={styles.logo} />
        </View>
      </View>

      {/* Buscador */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={{ marginRight: 10 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar usuario por nombre"
            placeholderTextColor="#666"
          />
        </View>
      </View>

      {/* Filtros de Categoría */}
      <View style={styles.filterBar}>
        <View style={styles.filterItem}>
          <View style={[styles.filterBox, { backgroundColor: "#3498db" }]} />
          <Text style={styles.filterLabel}>Todos</Text>
        </View>
        <View style={styles.filterItem}>
          <View style={[styles.filterBox, { backgroundColor: "#8ec444" }]} />
          <Text style={styles.filterLabel}>Dentro</Text>
        </View>
        <View style={styles.filterItem}>
          <View style={[styles.filterBox, { backgroundColor: "#e74c3c" }]} />
          <Text style={styles.filterLabel}>Fuera</Text>
        </View>
        <View style={styles.filterItem}>
          <View style={[styles.filterBox, { backgroundColor: "#e67e22" }]} />
          <Text style={styles.filterLabel}>Visitas</Text>
        </View>
      </View>

      {/* Lista de Usuarios */}
      <View style={styles.content}>
        <Text style={styles.listTitle}>Lista de Usuarios (1000)</Text>

        <FlatList
          data={usuarios}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.userCard}>
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.statusCircle,
                    { backgroundColor: item.status },
                  ]}
                />
                <Text style={styles.userName} numberOfLines={1}>
                  {item.nombre}
                </Text>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.actionButton, styles.editBtn]}>
                  <Text style={styles.editBtnText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteBtn]}
                >
                  <Text style={styles.actionButtonText}>Eliminar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.viewBtn]}>
                  <Text style={styles.actionButtonText}>Ver</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#CFE2EB", // Color azul clarito del fondo
  },
  header: {
    backgroundColor: "#34495e",
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "#bdc3c7",
    fontSize: 13,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 0,
    zIndex: 10,
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 0,
    resizeMode: "contain",
  },
  searchSection: {
    backgroundColor: "#CFE2EB",
    padding: 15,
  },
  searchContainer: {
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 45,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  filterBar: {
    backgroundColor: "#3c5a6b",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
  },
  filterItem: {
    alignItems: "center",
  },
  filterBox: {
    width: 45,
    height: 45,
    borderRadius: 8,
    marginBottom: 5,
  },
  filterLabel: {
    color: "white",
    fontSize: 12,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 15,
  },
  userCard: {
    backgroundColor: "#3c5a6b",
    borderRadius: 20,
    padding: 12,
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  statusCircle: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginRight: 10,
  },
  userName: {
    color: "white",
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  editBtn: {
    backgroundColor: "white",
  },
  deleteBtn: {
    backgroundColor: "#e74c3c",
  },
  viewBtn: {
    backgroundColor: "#1a59bf",
  },
  editBtnText: {
    color: "#3c5a6b",
    fontSize: 12,
    fontWeight: "bold",
  },
  actionButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});
