import React from "react";
import { Text, StyleSheet, View, Image, Dimensions, TouchableOpacity } from "react-native";
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get("window");

export default function RecuperarPassword({ navigation }) {
  const [fontsLoaded] = useFonts({
    Ultra: require("../assets/fonts/DelaGothicOne-Regular.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerSection}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Image source={require("../assets/logo2.png")} style={styles.loginLogo} />
      </View>

      <View style={styles.formSection}>
        <Icon name="lock-closed" size={80} color="#114B5F" style={{ marginBottom: 20 }} />
        <Text style={styles.ultraTitle}>Acceso Restringido</Text>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Por políticas de seguridad de AxisMx, no puedes restablecer tu contraseña de forma autónoma.
          </Text>
          <Text style={[styles.infoText, { marginTop: 15, fontWeight: 'bold' }]}>
            Por favor, solicita el cambio de tus credenciales directamente con el personal administrativo o de seguridad encargado.
          </Text>
        </View>

        <TouchableOpacity style={styles.footerLink} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Volver al inicio de sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#114B5F" },
  headerSection: { height: height * 0.25, justifyContent: 'center', alignItems: 'center' },
  backButton: { position: 'absolute', top: 50, left: 20, padding: 10 },
  loginLogo: { width: width * 0.25, height: width * 0.25, resizeMode: "contain" },
  formSection: { flex: 1, backgroundColor: "#F8F9FA", borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingHorizontal: 30, paddingTop: 50, alignItems: "center" },
  ultraTitle: { fontFamily: "Ultra", fontSize: 24, color: "#114B5F", textAlign: 'center' },
  infoCard: { backgroundColor: '#FFF', padding: 25, borderRadius: 20, marginTop: 30, width: '100%', elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  infoText: { fontSize: 15, color: '#365563', textAlign: 'center', lineHeight: 24 },
  footerLink: { marginTop: 40 },
  cancelText: { color: '#114B5F', fontWeight: 'bold', textDecorationLine: 'underline' },
});