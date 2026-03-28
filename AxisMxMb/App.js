import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pantallas de login y registro
import InicioSesion from './screens/InicioSesion';
import RegistroUsuario from './screens/RegistroUsuario';

// Pantallas para Administradores y Seguridad
import Dashboard from './screens/Dashboard';
import RegistrosAcceso from './screens/OpcionesScreens/RegistrosAcceso';
import Usuarios from './screens/OpcionesScreens/Usuarios';
import Roles from './screens/OpcionesScreens/Roles';
import MetodosAcceso from './screens/OpcionesScreens/MetodosAcceso';
import Visitantes from './screens/OpcionesScreens/Visitantes';
import Vehiculos from './screens/OpcionesScreens/Vehiculos';
// import ScanCredential from './screens/ScanCredential'; // Comentado hasta que exista
// import ScanPlate from './screens/ScanPlate'; // Comentado hasta que exista

// Pantallas para Usuarios normales (si las tienen)
// import DashboardUsuario from './screens/DashboardUsuario';
// import MiCredencial from './screens/MiCredencial';
// import MisAccesos from './screens/MisAccesos';
// import MiPerfil from './screens/MiPerfil';

const Stack = createNativeStackNavigator();

// Navegador para Administradores y Seguridad
function AdminStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="RegistrosAcceso" component={RegistrosAcceso} />
      <Stack.Screen name="Usuarios" component={Usuarios} />
      <Stack.Screen name="Roles" component={Roles} />
      <Stack.Screen name="MetodosAcceso" component={MetodosAcceso} />
      <Stack.Screen name="Visitantes" component={Visitantes} />
      <Stack.Screen name="Vehiculos" component={Vehiculos} />
      {/* <Stack.Screen name="ScanCredential" component={ScanCredential} /> */}
      {/* <Stack.Screen name="ScanPlate" component={ScanPlate} /> */}
    </Stack.Navigator>
  );
}

// Navegador para Usuarios normales (crea estas pantallas después)
function UserStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Por ahora, mientras crean las pantallas, redirige al Dashboard de admin como placeholder */}
      <Stack.Screen name="Dashboard" component={Dashboard} />
    </Stack.Navigator>
  );
}

// Navegador principal que decide qué mostrar según autenticación y rol
function AppNavigator() {
  const { isAuthenticated, loading, isAdminOrSecurity } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={InicioSesion} />
        <Stack.Screen name="Registro" component={RegistroUsuario} />
      </Stack.Navigator>
    );
  }

  if (isAdminOrSecurity()) {
    return <AdminStack />;
  } else {
    return <UserStack />;
  }
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}