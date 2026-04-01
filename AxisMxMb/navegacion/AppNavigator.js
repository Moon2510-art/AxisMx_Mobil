import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../utils/colors';

// Pantallas de autenticación
import InicioSesion from '../screens/InicioSesion';
import RegistroUsuario from '../screens/RegistroUsuario';

// Pantallas de administrador
import Dashboard from '../screens/Dashboard';
import ScannerScreen from '../screens/ScannerScreen';
import Perfil from '../screens/Perfil';

// Pantallas de gestión (admin)
import Usuarios from '../screens/OpcionesScreens/Usuarios';
import Vehiculos from '../screens/OpcionesScreens/Vehiculos';
import Roles from '../screens/OpcionesScreens/Roles';
import MetodosAcceso from '../screens/OpcionesScreens/MetodosAcceso';
import Visitantes from '../screens/OpcionesScreens/Visitantes';
import RegistrosAcceso from '../screens/OpcionesScreens/RegistrosAcceso';

// Pantallas de usuario normal (crear si no existen)
import DashboardUsuario from '../screens/DashboardUsuario';
import PerfilDigital from '../screens/CredencialDigital';
import MisAccesos from '../screens/MisAccesos';
import Perfil from '../screens/Perfil';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tabs para administradores
function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Scanner') {
            iconName = focused ? 'camera' : 'camera-outline';
          } else if (route.name === 'Historial') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
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

// Tabs para usuarios normales
function UserTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Credencial') {
            iconName = focused ? 'qr-code' : 'qr-code-outline';
          } else if (route.name === 'Mis Accesos') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Inicio" component={DashboardUsuario} />
      <Tab.Screen name="Credencial" component={PerfilDigital} />
      <Tab.Screen name="Mis Accesos" component={MisAccesos} />
      <Tab.Screen name="Perfil" component={Perfil} />
    </Tab.Navigator>
  );
}

// Stack para administradores
function AdminStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        headerBackTitle: 'Atrás',
      }}
    >
      <Stack.Screen name="MainTabs" component={AdminTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Usuarios" component={Usuarios} options={{ title: 'Gestión de Usuarios' }} />
      <Stack.Screen name="Vehiculos" component={Vehiculos} options={{ title: 'Gestión de Vehículos' }} />
      <Stack.Screen name="Roles" component={Roles} options={{ title: 'Gestión de Roles' }} />
      <Stack.Screen name="MetodosAcceso" component={MetodosAcceso} options={{ title: 'Métodos de Acceso' }} />
      <Stack.Screen name="Visitantes" component={Visitantes} options={{ title: 'Gestión de Visitantes' }} />
    </Stack.Navigator>
  );
}

// Stack para usuarios normales
function UserStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
      }}
    >
      <Stack.Screen name="UserTabs" component={UserTabs} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

// Stack de autenticación
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={InicioSesion} />
      <Stack.Screen name="Registro" component={RegistroUsuario} />
    </Stack.Navigator>
  );
}

// Navegador principal
export default function AppNavigator() {
  const { isAuthenticated, loading, userRole } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <AuthStack />;
  }

  // Roles permitidos para la app de administración
  const adminRoles = ['Administrativo', 'Seguridad'];
  
  if (adminRoles.includes(userRole)) {
    return <AdminStack />;
  }

  // Usuarios normales
  return <UserStack />;
}