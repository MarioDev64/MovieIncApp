import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { AuthStackNavigationProp, AuthStackParamList } from '../@types';

const ApprovalScreen: React.FC = () => {
  const navigation = useNavigation<AuthStackNavigationProp>();
  const route = useRoute<RouteProp<AuthStackParamList, 'Approval'>>();
  const { requestToken } = route.params;

  const handleContinueLogin = () => {
    navigation.navigate('Login', { isReturningFromApproval: true, requestToken });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/approval.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Aprobación Requerida</Text>
        <Text style={styles.text}>
          Por favor aprueba la petición en tu navegador. Una vez aprobado, haz clic en el botón "Continuar con Inicio de Sesión" para validar tus credenciales.
        </Text>
        <Button 
          mode="contained" 
          onPress={handleContinueLogin} 
          style={styles.button}
        >
          Continuar con Inicio de Sesión
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  button: {
    marginTop: 20,
    minWidth: 200,
    borderRadius: 25,
  },
});

export default ApprovalScreen;