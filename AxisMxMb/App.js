import { View } from 'react-native';
import InicioSesion  from './screens/InicioSesion';
import Dashboard from './screens/Dashboard';
import Ajustes from './screens/Ajustes';
import Usuarios from './screens/Usuarios';
import Registros from './screens/Registros';
export default function App() {
  return (
    <View style={{flex:1}}>
      <InicioSesion></InicioSesion>
    </View>
  );
}
