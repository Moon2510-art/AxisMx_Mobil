import { SafeAreaProvider } from 'react-native-safe-area-context';
import InicioSesion  from './screens/InicioSesion';
import Dashboard from './screens/Dashboard';
import RegistrosAcceso from './screens/OpcionesScreens/RegistrosAcceso';
import Usuarios from './screens/OpcionesScreens/Usuarios';
import Roles from './screens/OpcionesScreens/Roles';
import MetodosAcceso from './screens/OpcionesScreens/MetodosAcceso';
import Visitantes from './screens/OpcionesScreens/Visitantes';
import Vehiculos from './screens/OpcionesScreens/Vehiculos';
export default function App() {
  return (
    <SafeAreaProvider>
      <Vehiculos></Vehiculos>
    </SafeAreaProvider>
  );
}
