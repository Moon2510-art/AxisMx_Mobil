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
import React, { useState, useEffect } from "react";
import { useFonts } from 'expo-font';
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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
  };

  return (
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
        </View>
      </View>
    </View>
  );
};

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
}

const stylesIntro = StyleSheet.create({
  pantallaInicialContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#365563",
  },

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
  },
});
