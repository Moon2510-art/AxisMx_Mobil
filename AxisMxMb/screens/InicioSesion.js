import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  Image,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
<<<<<<< HEAD
import { useAuth } from "../context/AuthContext";
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/Ionicons';

=======
import React, { useState, useEffect } from "react";
import { useFonts } from 'expo-font';
>>>>>>> main
const { width, height } = Dimensions.get("window");

// --- Pantalla de Carga (Splash) ---
const PantallaInicial = () => (
  <View style={styles.splashContainer}>
    <Image source={require("../assets/logo2.png")} style={styles.splashLogo} />
    <Text style={styles.splashTitle}>AxisMx</Text>
    <ActivityIndicator size="large" color="#C8DFEA" style={{ marginTop: 30 }} />
  </View>
);

// --- Componente de Login ---
const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Campos vacíos", "Por favor ingresa tus credenciales.");
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.success) {
      Alert.alert("Error de acceso", result.message || "Correo o contraseña incorrectos.");
    }
  };

  return (
<<<<<<< HEAD
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.mainContainer}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
        {/* Parte Superior: Logo */}
        <View style={styles.headerSection}>
          <Image source={require("../assets/logo2.png")} style={styles.loginLogo} />
=======
    <View style={stylesLogin.containerLogin}>
      <View style={stylesLogin.logoContainer}>
        <Image
          source={require("../assets/logo2.png")}
          style={stylesLogin.logo}
          resizeMode="contain"
        />
      </View>

      <View style={stylesLogin.containerInput}>
        <Text style={stylesLogin.titulo}>AxisMx</Text>

        <TextInput
          style={stylesLogin.input}
          placeholder="Correo"
          placeholderTextColor="#365563"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={stylesLogin.input}
          placeholder="Contraseña"
          placeholderTextColor="#365563"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />

        <TouchableOpacity
          style={[stylesLogin.botonSesion, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={stylesLogin.botonText}>Iniciar sesión</Text>
          )}
        </TouchableOpacity>

        <View style={stylesLogin.linksContainer}>
          <TouchableOpacity>
            <Text style={stylesLogin.linkText}>
              ¿Has olvidado tu contraseña?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={stylesLogin.linkText}>Crear cuenta</Text>
          </TouchableOpacity>
>>>>>>> main
        </View>

        {/* Parte Inferior: Formulario */}
        <View style={styles.formSection}>
          <Text style={styles.ultraTitle}>AxisMx</Text>
          {/* Input Correo */}
          <View style={styles.inputWrapper}>
            <Icon name="mail-outline" size={20} color="#114B5F" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Input Contraseña */}
          <View style={styles.inputWrapper}>
            <Icon name="lock-closed-outline" size={20} color="#114B5F" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate("Recuperar")}>
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginBtn, loading && { opacity: 0.8 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.loginBtnText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerRow}>
            <Text style={{ color: '#666' }}>¿No tienes cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Registro")}>
              <Text style={styles.registerLink}>Regístrate aquí</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

<<<<<<< HEAD
export default function InicioSesion({ navigation }) {
  const [showSplash, setShowSplash] = useState(true);
  const [fontsLoaded] = useFonts({
    Ultra: require("../assets/fonts/DelaGothicOne-Regular.ttf"),
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash || !fontsLoaded) return <PantallaInicial />;

  return <Login navigation={navigation} />;
=======
export default function InicioSesion() {
  const [fontsLoaded] = useFonts({
    Ultra: require("../assets/fonts/DelaGothicOne-Regular.ttf"),
  });
  const [inicioApp, setInicioApp] = useState(true);
  
  useEffect(() => {
    const tiempo = setTimeout(() => {
      setInicioApp(false);
    }, 3000);
    
    return () => clearTimeout(tiempo);
  }, []);
  
  if (inicioApp) {
  
    return <PantallaInicial />;
  } else {
    return <Login />;
  }
>>>>>>> main
}

const styles = StyleSheet.create({
  // Splash Styles
  splashContainer: {
    flex: 1,
    backgroundColor: "#114B5F",
    justifyContent: "center",
    alignItems: "center",
  },
  splashLogo: { width: width * 0.4, height: width * 0.4, resizeMode: "contain" },
  splashTitle: { fontSize: 32, color: "#FFFFFF", fontWeight: "bold", marginTop: 20 },

<<<<<<< HEAD
  // Login Styles
  mainContainer: { flex: 1, backgroundColor: "#114B5F" },
  headerSection: {
    height: height * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginLogo: { width: width * 0.35, height: width * 0.35, resizeMode: "contain" },
  formSection: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 30,
    paddingTop: 40,
    alignItems: "center",
=======
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },

  nombreApp: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
  },
});

const stylesLogin = StyleSheet.create({
  containerLogin: {
    flex: 1,
    backgroundColor: "#365563",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 20, 
  },

  logo: {
    width: 120,
    height: 120,
  },

  containerInput: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#8EB1C2",
    borderRadius: 25,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  titulo: {
    fontSize: 34,
    marginBottom: 25,
    alignSelf: "center",
    color: "#365563",
    fontFamily: "Ultra",
  },

  input: {
    width: "100%",
    height: 50,
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#8EB1C2",
    elevation: 5,
    boxShadow: "0px 2px 4px rgba(142,177,194,0.3)",
    fontFamily: "Montserrat",
  },

  botonSesion: {
    width: "100%",
    height: 50,
    backgroundColor: "#365563",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  botonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Montserrat",
  },

  linksContainer: {
    width: "100%",
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  linkText: {
    color: "#365563",
    fontSize: 13,
    fontFamily: "Montserrat",
>>>>>>> main
  },
  ultraTitle: { fontFamily: "Ultra", fontSize: 34, color: "#114B5F" },
  subTitle: { fontSize: 14, color: "#666", marginBottom: 30 },
  
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '100%',
    height: 55,
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EEE',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#333' },
  
  forgotText: {
    alignSelf: 'flex-end',
    color: '#114B5F',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 25,
  },
  loginBtn: {
    backgroundColor: "#114B5F",
    width: "100%",
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  loginBtnText: { color: "white", fontSize: 18, fontWeight: "bold" },
  
  registerRow: { flexDirection: 'row', marginTop: 25 },
  registerLink: { color: '#114B5F', fontWeight: 'bold', textDecorationLine: 'underline' }
});