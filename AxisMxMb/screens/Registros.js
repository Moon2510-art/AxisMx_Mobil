import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image
} from "react-native";
import React from "react";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

export default function Registros() {
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

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Agregar nuevo usuario</Text>

        {/* Campo: Nombre */}
        <TextInput
          style={styles.input}
          placeholder="Nombre del Usuario"
          placeholderTextColor="#666"
        />

        {/* Campo: Matricula */}
        <TextInput
          style={styles.input}
          placeholder="Matricula"
          placeholderTextColor="#666"
        />

        {/* Simulación de Dropdown: Rol */}
        <TouchableOpacity style={styles.dropdown} activeOpacity={0.7}>
          <Text style={styles.dropdownText}>Rol del Usuario</Text>
          <Ionicons name="chevron-down" size={20} color="#3c5a6b" />
        </TouchableOpacity>

        {/* Simulación de Dropdown: Acceso */}
        <TouchableOpacity style={styles.dropdown} activeOpacity={0.7}>
          <Text style={styles.dropdownText}>Tipo de Acceso</Text>
          <Ionicons name="chevron-down" size={20} color="#3c5a6b" />
        </TouchableOpacity>

        {/* Simulación de Dropdown: Ingreso/Salida */}
        <TouchableOpacity style={styles.dropdown} activeOpacity={0.7}>
          <Text style={styles.dropdownText}>Ingreso, Salida, Visita</Text>
          <Ionicons name="chevron-down" size={20} color="#3c5a6b" />
        </TouchableOpacity>

        {/* Campo: Fecha con Icono */}
        <TouchableOpacity style={styles.dropdown} activeOpacity={0.7}>
          <Text style={styles.dropdownText}>Fecha</Text>
          <MaterialCommunityIcons
            name="calendar-month-outline"
            size={22}
            color="#3c5a6b"
          />
        </TouchableOpacity>

        {/* Botón Guardar */}
        <TouchableOpacity style={styles.saveButton} activeOpacity={0.8}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </ScrollView>
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
  content: {
    padding: 25,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3c5a6b",
    marginBottom: 30,
    alignSelf: "flex-start",
  },
  input: {
    width: "100%",
    backgroundColor: "white",
    height: 55,
    borderRadius: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontSize: 16,
    // Sombra suave para iOS/Android
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dropdown: {
    width: "100%",
    backgroundColor: "white",
    height: 55,
    borderRadius: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dropdownText: {
    color: "#666",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#3c5a6b", // Azul grisáceo oscuro
    width: "60%",
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
    elevation: 4,
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
