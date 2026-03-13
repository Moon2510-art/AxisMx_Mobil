import { Text, StyleSheet, View, TextInput, Image, ActivityIndicator, Dimensions, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
const {width, height} = Dimensions.get('window');


// Funcion Pantalla de carga

const PantallaInicial = () => {
  return (
    <View style={stylesIntro.pantallaInicialContainer}>

      <Image
        source={require("../assets/logo2.png")}
        style={stylesIntro.logo}
        
      />

      <Text style={stylesIntro.nombreApp}>AXISMX</Text>
      <ActivityIndicator size="large" color="white" style={{marginTop: 40}}/>

    </View>
  );
};


// Funcion Inicio de sesion

const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
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
        />

      </View>

      <Text style={stylesLogin.titulo}>Iniciar sesión</Text>

      <TextInput
        style={stylesLogin.input}
        placeholder="Correo"
        placeholderTextColor="#0AA6A6"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={stylesLogin.input}
        placeholder="Contraseña"
        placeholderTextColor="#0AA6A6"
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

        <TouchableOpacity
        >
          <Text style={stylesLogin.linkText}>¿Has olvidado tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity
        >
          <Text style={stylesLogin.linkText}>Crear cuenta</Text>
        </TouchableOpacity>

      </View>


    </View>

    
  );

}






export default function InicioSesion() {
  const [inicioApp, setInicioApp] = useState(true);

  useEffect( () => {
    const tiempo = setTimeout(() => {
      setInicioApp(false);
    }, 3000);

    return () => clearTimeout(tiempo);
  }, []);


  if (inicioApp) {
    return <PantallaInicial/>;
  } else {
    return (
      <Login/>
    )
  }

   
}

const stylesIntro = StyleSheet.create({

  pantallaInicialContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0477BF',
  },

  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },

  nombreApp: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
  },

});

const stylesLogin = StyleSheet.create({

  containerLogin: {
    flex: 1,
    backgroundColor: '#0477BF',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  

  logoContainer: {
    alignItems: 'center',
    marginTop: 0,
    zIndex: 10,
  },

  logo:{
    width: 150,
    height: 150,
    marginBottom: 10,
    resizeMode: 'contain',
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-start',
    color: '#FFFFFF',
    zIndex: 10,
    fontFamily: 'Montserrat',
  },

  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 40,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    fontFamily: 'Montserrat',
    zIndex: 10,
  },

  botonSesion: {
    width: '100%',
    height: 50,
    backgroundColor: '#0AA6A6',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    zIndex: 10,
  },

  botonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
  },

  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 30,
    paddingHorizontal: 10,
    zIndex: 10,
  },

  linkText: {
    color: '#FFFFFF',
    fontSize: 14,
  },


});