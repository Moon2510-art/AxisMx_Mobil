import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  StatusBar, 
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';

const { width } = Dimensions.get("window");

export default function WelcomeScreen({ navigation }) {
  // Cargamos la fuente 'Ultra' para que el título se vea profesional
  const [fontsLoaded] = useFonts({
    Ultra: require("../assets/fonts/DelaGothicOne-Regular.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      {/* StatusBar blanca para resaltar en el fondo oscuro */}
      <StatusBar barStyle="light-content" backgroundColor="#114B5F" />
      
      <View style={styles.content}>
        
        {/* --- SECCIÓN DEL LOGO --- */}
        <View style={styles.logoContainer}>
          <Image 
            source={require("../assets/logo2.png")} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* --- TÍTULO PRINCIPAL --- */}
        <View style={styles.titleContainer}>
          <Text style={styles.brandTitle}>AxisMx</Text>
        </View>

        {/* --- BOTONES DE ACCIÓN --- */}
        <View style={styles.footer}>
          {/* Botón Principal: Iniciar Sesión (Relleno Blanco) */}
          <TouchableOpacity 
            style={styles.btnPrimary}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.btnTextPrimary}>Iniciar Sesión</Text>
          </TouchableOpacity>

          {/* Botón Secundario: Registro (Delineado Blanco) */}
          <TouchableOpacity 
            style={styles.btnSecondary}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Registro')}
          >
            <Text style={styles.btnTextSecondary}>Crear cuenta nueva</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.versionText}>v1.0.0 • UPQ Seguridad</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#114B5F" // Azul petróleo de tu imagen
  },
  content: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: 40 
  },
  
  // Estilo del logo
  logoContainer: {
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: { 
    width: width * 0.45,
    height: width * 0.45
  },

  // Estilo del Título AxisMx
  titleContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  brandTitle: { 
    fontFamily: "Ultra", 
    fontSize: 48, 
    color: "#FFFFFF",
    letterSpacing: 2,
    fontWeight: '700'
  },

  // Contenedor de botones
  footer: { 
    width: '100%',
    gap: 18,
    marginTop: 20,
  },
  btnPrimary: { 
    backgroundColor: "#FFFFFF", 
    paddingVertical: 16, 
    borderRadius: 12, 
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  btnTextPrimary: { 
    color: "#114B5F", 
    fontSize: 16, 
    fontWeight: '700' 
  },
  btnSecondary: { 
    backgroundColor: "transparent", 
    paddingVertical: 16, 
    borderRadius: 12, 
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: "#FFFFFF"
  },
  btnTextSecondary: { 
    color: "#FFFFFF", 
    fontSize: 16, 
    fontWeight: '700' 
  },
  
  versionText: {
    position: 'absolute',
    bottom: 30,
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
  }
});