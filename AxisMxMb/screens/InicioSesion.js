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
} from "react-native";
import { useAuth  } from "../context/AuthContext";
import React, { useState, useEffect } from "react";
const { width, height } = Dimensions.get("window");

// Funcion Pantalla de carga
const PantallaInicial = () => {
  return (
    <View style={stylesIntro.pantallaInicialContainer}>
      <Image source={require("../assets/logo2.png")} style={stylesIntro.logo} />

      <Text style={stylesIntro.nombreApp}>AxisMx</Text>
      <ActivityIndicator size="large" color="white" style={{ marginTop: 40 }} />
    </View>
  );
};

// Funcion Inicio de sesion

const Login = ({navigation}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      Alert.alert("Error", result.message || "Credenciales incorrectas");
    }
  };

  const handleRegister = () => {
    navigation.navigate("Registro");
  };

  return (
    <View style={stylesLogin.containerLogin}>
      <View style={stylesLogin.logoContainer}>
        <Image
          source={require("../assets/logo2.png")}
          style={stylesLogin.logo}
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
            <Text style={stylesLogin.linkText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleRegister}>
            <Text style={stylesLogin.linkText}>Crear cuenta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default function InicioSesion({ navigation }) {
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
    return <Login navigation={navigation} />;
  }
}

const stylesIntro = StyleSheet.create({
  pantallaInicialContainer: {
    flex: 1,
    backgroundColor: "#114B5F",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    resizeMode: "contain",
  },
  nombreApp: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 20,
  },
});

const stylesLogin = StyleSheet.create({
  containerLogin: {
    flex: 1,
    backgroundColor: "#114B5F",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: height * 0.1,
  },
  logo: {
    width: width * 0.3,
    height: width * 0.3,
    resizeMode: "contain",
  },
  containerInput: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    marginTop: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: "center",
    paddingTop: 30,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#114B5F",
    marginBottom: 5,
  },
  subtitulo: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
  },
  input: {
    width: width * 0.8,
    height: 50,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  botonSesion: {
    width: width * 0.8,
    height: 50,
    backgroundColor: "#114B5F",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  botonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  linksContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.8,
    marginTop: 20,
  },
  linkText: {
    color: "#114B5F",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});