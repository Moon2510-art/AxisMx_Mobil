import {
  Text,
  StyleSheet,
  View,
  TextInput,
  FlatList,
  ScrollView,
  Image
} from "react-native";
import React from "react";

export default function dashboard() {
  const actividadReciente = [
    {
      id: "1",
      nombre: "Cervantes Santana Cristobal Eduardo",
      hora: "2:10 PM - Entrada",
      status: "green",
    },
    {
      id: "2",
      nombre: "Isaac Lopez Madrigal",
      hora: "2:00 PM - Entrada",
      status: "green",
    },
    {
      id: "3",
      nombre: "Hernandez Maldonado Aldo Uriel",
      hora: "1:50 PM - Entrada",
      status: "red",
    },
    {
      id: "4",
      nombre: "Jimenez Perez Valentina",
      hora: "1:40 PM - Entrada",
      status: "orange",
    },
    {
      id: "5",
      nombre: "Zavala Trejo Marcol",
      hora: "1:30 PM - Entrada",
      status: "green",
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
          <Image
            source={require("../assets/logo2.png")}
            style={styles.logo}
          />
        </View>
      </View>

      <View style={styles.content}>
        {/* Buscador */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar usuario reciente por nombre"
            placeholderTextColor="#666"
          />
        </View>

        {/* Cuadros de Estadísticas */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: "#3498db" }]}>
            <Text style={styles.statNumber}>1040</Text>
            <Text style={styles.statLabel}>Registros totales hoy</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: "#8ec444" }]}>
            <Text style={styles.statNumber}>1000</Text>
            <Text style={styles.statLabel}>Dentro</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: "#e74c3c" }]}>
            <Text style={styles.statNumber}>30</Text>
            <Text style={styles.statLabel}>Salidas</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: "#e67e22" }]}>
            <Text style={styles.statNumber}>10</Text>
            <Text style={styles.statLabel}>Visitantes</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Actividad Reciente</Text>

        {/* Lista de Actividad */}
        <FlatList
          data={actividadReciente}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.activityCard}>
              <View
                style={[
                  styles.statusIndicator,
                  { backgroundColor: item.status },
                ]}
              />
              <View>
                <Text style={styles.personName}>{item.nombre}</Text>
                <Text style={styles.activityTime}>{item.hora}</Text>
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
    backgroundColor: '#CFE2EB', // Color azul clarito del fondo
  },
  header: {
    backgroundColor: '#34495e',
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#bdc3c7',
    fontSize: 13,
  },
  logoPlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    opacity: 0.8,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  searchContainer: {
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 45,
    justifyContent: 'center',
    elevation: 2,
  },
  searchInput: {
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    height: 80,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    padding: 5,
  },
  statNumber: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'white',
    fontSize: 11,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  activityCard: {
    backgroundColor: '#3c5a6b', // Color grisáceo azulado de las filas
    borderRadius: 30,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusIndicator: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginRight: 15,
  },
  personName: {
    color: 'white',
    fontSize: 13,
    fontWeight: '500',
  },
  activityTime: {
    color: '#bdc3c7',
    fontSize: 11,
    marginTop: 2,
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
})
