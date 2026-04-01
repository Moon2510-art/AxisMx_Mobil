import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, useAuth } from './context/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';

// --- Pantallas de Bienvenida y Autenticación ---
import WelcomeScreen from './screens/WelcomeScreen';
import InicioSesion from './screens/InicioSesion';
import RegistroUsuario from './screens/RegistroUsuario';
import RecuperarPassword from './screens/RecuperarPassword';

// --- Pantallas de Administración ---
import Dashboard from './screens/Dashboard';
import ScannerScreen from './screens/ScannerScreen';
import Perfil from './screens/Perfil';
import Usuarios from './screens/OpcionesScreens/Usuarios';
import Vehiculos from './screens/Vehiculos';
import Roles from './screens/OpcionesScreens/Roles';
import MetodosAcceso from './screens/OpcionesScreens/MetodosAcceso';
import Visitantes from './screens/OpcionesScreens/Visitantes';
import RegistrosAcceso from './screens/OpcionesScreens/RegistrosAcceso';
import EditarUsuario from './screens/EditarUsuario';
import CrearUsuario from './screens/CrearUsuario';

// --- Pantallas de Usuario ---
import CambiarPassword from './screens/CambiarPassword';
import DashboardUsuario from './screens/DashboardUsuario';
import CredencialDigital from './screens/CredencialDigital';
import MisAccesos from './screens/MisAccesos';
import MisVehiculos from './screens/MisVehiculos';
import AgregarVehiculo from './screens/AgregarVehiculo';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ============ TABS PARA ADMINISTRADORES ============
function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Scanner') iconName = focused ? 'camera' : 'camera-outline';
          else if (route.name === 'Historial') iconName = focused ? 'list' : 'list-outline';
          else if (route.name === 'Perfil') iconName = focused ? 'person' : 'person-outline';
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#114B5F',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { height: 65, paddingBottom: 10 },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="Scanner" component={ScannerScreen} />
      <Tab.Screen name="Historial" component={RegistrosAcceso} />
      <Tab.Screen name="Perfil" component={Perfil} />
    </Tab.Navigator>
  );
}

// ============ STACK PARA ADMINISTRADORES ============
function AdminStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#114B5F' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        headerBackTitle: 'Atrás',
      }}
    >
      <Stack.Screen name="MainTabs" component={AdminTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Usuarios" component={Usuarios} options={{ title: 'Gestión de Usuarios' }} />
      <Stack.Screen name="Vehiculos" component={Vehiculos} options={{ title: 'Gestión de Vehículos' }} />
      <Stack.Screen name="Roles" component={Roles} options={{ title: 'Gestión de Roles' }} />
      <Stack.Screen name="MetodosAcceso" component={MetodosAcceso} options={{ title: 'Métodos de Acceso' }} />
      <Stack.Screen name="Visitantes" component={Visitantes} options={{ title: 'Gestión de Visitantes' }} />
      <Stack.Screen name="EditarUsuario" component={EditarUsuario} options={{ title: 'Editar Usuario' }} />
      <Stack.Screen name="CrearUsuario" component={CrearUsuario} options={{ title: 'Crear Usuario' }} />
      <Stack.Screen name="CambiarPassword" component={CambiarPassword} options={{ title: 'Cambiar Contraseña' }} />
    </Stack.Navigator>
  );
}

// ============ TABS PARA USUARIOS ============
function UserTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Inicio') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Credencial') iconName = focused ? 'id-card' : 'id-card-outline';
          else if (route.name === 'Vehículos') iconName = focused ? 'car' : 'car-outline';
          else if (route.name === 'Accesos') iconName = focused ? 'time' : 'time-outline';
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#114B5F',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { height: 65, paddingBottom: 10 },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Inicio" component={DashboardUsuario} />
      <Tab.Screen name="Credencial" component={CredencialDigital} />
      <Tab.Screen name="Vehículos" component={MisVehiculos} />
      <Tab.Screen name="Accesos" component={MisAccesos} />
    </Tab.Navigator>
  );
}

// ============ STACK PARA USUARIOS ============
function UserStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#114B5F' },
        headerTintColor: '#fff',
        headerBackTitle: 'Atrás',
      }}
    >
      <Stack.Screen name="UserTabs" component={UserTabs} options={{ headerShown: false }} />
      <Stack.Screen name="CambiarPassword" component={CambiarPassword} options={{ title: 'Cambiar Contraseña' }} />
      <Stack.Screen 
        name="AgregarVehiculo" 
        component={AgregarVehiculo} 
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// ============ STACK DE AUTENTICACIÓN ============
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={InicioSesion} />
      <Stack.Screen name="Registro" component={RegistroUsuario} />
      <Stack.Screen name="Recuperar" component={RecuperarPassword} />
    </Stack.Navigator>
  );
}

// ============ NAVEGADOR PRINCIPAL ============
function AppNavigator() {
  const { isAuthenticated, loading, userRole } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <AuthStack />;
  }

  const adminRoles = ['Administrador', 'Seguridad'];
  const isAdmin = adminRoles.includes(userRole);

  return isAdmin ? <AdminStack /> : <UserStack />;
}

// ============ APP PRINCIPAL ============
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