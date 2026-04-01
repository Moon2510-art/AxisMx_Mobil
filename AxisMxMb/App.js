import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, useAuth } from './context/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';

// --- Pantallas de Autenticación ---
import InicioSesion from './screens/InicioSesion';
import RegistroUsuario from './screens/RegistroUsuario';
import RecuperarPassword from './screens/RecuperarPassword';

// --- Pantallas principales y Gestión ---
import Dashboard from './screens/Dashboard';
<<<<<<< HEAD
import ScannerScreen from './screens/ScannerScreen';
import Perfil from './screens/Perfil';
import CambiarPassword from './screens/OpcionesScreens/CambiarPassword';
import Notificaciones from './screens/OpcionesScreens/Notificaciones';
import Usuarios from './screens/OpcionesScreens/Usuarios';
import Vehiculos from './screens/OpcionesScreens/Vehiculos';
import Roles from './screens/OpcionesScreens/Roles';
import MetodosAcceso from './screens/OpcionesScreens/MetodosAcceso';
import Visitantes from './screens/OpcionesScreens/Visitantes';
import RegistrosAcceso from './screens/OpcionesScreens/RegistrosAcceso';
import EditarUsuario from './screens/OpcionesScreens/EditarUsuario';
import CrearUsuario from './screens/OpcionesScreens/CrearUsuario';

// --- Pantallas para Usuarios ---
import DashboardUsuario from './screens/DashboardUsuario';
import MiCredencial from './screens/MiCredencial';
import MisAccesos from './screens/MisAccesos';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ============ 1. TABS PARA ADMINISTRADORES ============
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
        tabBarStyle: { height: 60, paddingBottom: 10 },
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

// ============ 2. STACK PARA ADMINISTRADORES ============
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
      <Stack.Screen name="Notificaciones" component={Notificaciones} options={{ headerShown: false }} />
      <Stack.Screen name="CambiarPassword" component={CambiarPassword} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

// ============ 3. TABS PARA USUARIOS NORMALES ============
function UserTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Inicio') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Credencial') iconName = focused ? 'qr-code' : 'qr-code-outline';
          else if (route.name === 'Mis Accesos') iconName = focused ? 'time' : 'time-outline';
          else if (route.name === 'Perfil') iconName = focused ? 'person' : 'person-outline';
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#114B5F',
        tabBarInactiveTintColor: '#888',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Inicio" component={DashboardUsuario} />
      <Tab.Screen name="Credencial" component={MiCredencial} />
      <Tab.Screen name="Mis Accesos" component={MisAccesos} />
      <Tab.Screen name="Perfil" component={Perfil} /> 
    </Tab.Navigator>
  );
}

// ============ 4. STACK PARA USUARIOS NORMALES ============
function UserStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#114B5F' },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen name="UserTabs" component={UserTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Notificaciones" component={Notificaciones} options={{ headerShown: false }} />
      <Stack.Screen name="CambiarPassword" component={CambiarPassword} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

// ============ 5. STACK DE AUTENTICACIÓN (UN SOLO DUPLICADO ELIMINADO) ============
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={InicioSesion} />
      <Stack.Screen name="Registro" component={RegistroUsuario} />
      <Stack.Screen name="Recuperar" component={RecuperarPassword} />
    </Stack.Navigator>
  );
}

// ============ 6. NAVEGADOR PRINCIPAL ============
function AppNavigator() {
  const { isAuthenticated, loading, userRole } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <AuthStack />;
  }

  const adminRoles = ['Administrador', 'Seguridad'];
  
  if (adminRoles.includes(userRole)) {
    return <AdminStack />;
  }

  return <UserStack />;
}

// ============ 7. APP PRINCIPAL ============
=======
import Vehiculos from './screens/Vehiculos';
>>>>>>> main
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