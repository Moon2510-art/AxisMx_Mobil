import { SafeAreaProvider } from 'react-native-safe-area-context';
import InicioSesion  from './screens/InicioSesion';
import Dashboard from './screens/Dashboard';
import Vehiculos from './screens/Vehiculos';
export default function App() {
  return (
    <SafeAreaProvider>
      <Vehiculos></Vehiculos>
    </SafeAreaProvider>
  );
}
