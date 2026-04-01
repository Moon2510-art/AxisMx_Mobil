import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Switch,
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';

export default function PerfilConfig({ navigation }) {
  const { user, logout } = useAuth();
  const [isEnabled, setIsEnabled] = React.useState(false);

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres salir?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Salir", onPress: logout, style: "destructive" }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Encabezado de Usuario */}
        <View style={styles.userHeader}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarLetter}>
              {user?.Nombre ? user.Nombre.charAt(0) : 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.Nombre} {user?.Ap_Paterno}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        {/* Sección: Seguridad */}
        <Text style={styles.sectionTitle}>Seguridad</Text>
        <View style={styles.menuGroup}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('CambiarPassword')}
          >
            <View style={[styles.iconBox, { backgroundColor: '#E8F0F2' }]}>
              <Icon name="lock-closed" size={20} color="#114B5F" />
            </View>
            <Text style={styles.menuText}>Cambiar Contraseña</Text>
            <Icon name="chevron-forward" size={18} color="#CCC" />
          </TouchableOpacity>

          <View style={styles.menuItem}>
            <View style={[styles.iconBox, { backgroundColor: '#E8F0F2' }]}>
              <Icon name="finger-print" size={20} color="#114B5F" />
            </View>
            <Text style={styles.menuText}>Acceso con Biométrica</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#114B5F" }}
              thumbColor={isEnabled ? "#FFF" : "#f4f3f4"}
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
        </View>

        {/* Sección: Información */}
        <Text style={styles.sectionTitle}>Soporte e Información</Text>
        <View style={styles.menuGroup}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.iconBox, { backgroundColor: '#F0F0F0' }]}>
              <Icon name="help-circle" size={20} color="#666" />
            </View>
            <Text style={styles.menuText}>Centro de Ayuda</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.iconBox, { backgroundColor: '#F0F0F0' }]}>
              <Icon name="document-text" size={20} color="#666" />
            </View>
            <Text style={styles.menuText}>Términos y Condiciones</Text>
          </TouchableOpacity>
        </View>

        {/* Botón Salir */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Versión 1.0.0 (AxisMx)</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  userHeader: { 
    alignItems: 'center', 
    paddingVertical: 30, 
    backgroundColor: '#FFF', 
    borderBottomWidth: 1, 
    borderBottomColor: '#EEE' 
  },
  avatarPlaceholder: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    backgroundColor: '#114B5F', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 15
  },
  avatarLetter: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
  userName: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  userEmail: { fontSize: 14, color: '#888', marginTop: 4 },
  
  sectionTitle: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#999', 
    marginLeft: 25, 
    marginTop: 25, 
    marginBottom: 10,
    textTransform: 'uppercase'
  },
  menuGroup: { 
    backgroundColor: '#FFF', 
    borderTopWidth: 1, 
    borderBottomWidth: 1, 
    borderColor: '#EEE' 
  },
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15, 
    paddingLeft: 25,
    borderBottomWidth: 1, 
    borderBottomColor: '#F5F5F5'
  },
  iconBox: { 
    width: 36, 
    height: 36, 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 15 
  },
  menuText: { flex: 1, fontSize: 16, color: '#444' },
  
  logoutBtn: { 
    margin: 25, 
    backgroundColor: '#FFF', 
    padding: 15, 
    borderRadius: 12, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFC1C1'
  },
  logoutBtnText: { color: '#E74C3C', fontWeight: 'bold', fontSize: 16 },
  versionText: { textAlign: 'center', color: '#CCC', fontSize: 12, marginBottom: 30 }
});
