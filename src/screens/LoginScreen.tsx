import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Linking, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { useNavigation, useIsFocused, useRoute, RouteProp } from '@react-navigation/native';
import { AuthStackNavigationProp, AuthStackParamList } from '../@types';
import { AxiosError } from 'axios';
import { approveRequestToken } from '../services/Authentication';

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('El nombre de usuario es requerido'),
  password: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es requerida'),
});

interface FormValues {
  username: string;
  password: string;
}

const LoginScreen: React.FC = () => {
  const { login, completeLogin, loading } = useAuth();
  const [error, setError] = useState<string>('');
  const navigation = useNavigation<AuthStackNavigationProp>();
  const route = useRoute<RouteProp<AuthStackParamList, 'Login'>>();
  const [lastRequestToken, setLastRequestToken] = useState<string | null>(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && route.params?.isReturningFromApproval && lastRequestToken) {
      handleCompleteLogin(lastRequestToken);
    }
  }, [isFocused, route.params?.isReturningFromApproval]);

  const handleLogin = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    setError('');
    try {
      const requestToken = await login(values.username, values.password);
      setLastRequestToken(requestToken);
      await approveRequestToken(requestToken);
      navigation.navigate('Approval', { requestToken });
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        if (err.response.data.status_code === 30) {
          setError('Credenciales inválidas. Correo Electrónico o Contraseña incorrectos.');
        } else {
          setError(err.response.data.message);
        }
      } else {
        console.error(err);
        setError('Ha ocurrido un error inesperado.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteLogin = async (requestToken: string) => {
    try {
      await completeLogin(requestToken);
    } catch (err) {
      setError('Error al completar el inicio de sesión. Por favor, intente nuevamente.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.keyboard} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Image
            source={require('../../assets/logo.jpeg')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Formik
            initialValues={{ username: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={styles.formContainer}>
                <TextInput
                  label="Nombre de usuario"
                  value={values.username}
                  onChangeText={handleChange('username')}
                  onBlur={handleBlur('username')}
                  error={touched.username && !!errors.username}
                  style={styles.input}
                />
                <HelperText type="error" visible={touched.username && !!errors.username}>
                  {errors.username}
                </HelperText>
                <TextInput
                  label="Contraseña"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  secureTextEntry
                  error={touched.password && !!errors.password}
                  style={styles.input}
                />
                <HelperText type="error" visible={touched.password && !!errors.password}>
                  {errors.password}
                </HelperText>
                <Button mode="contained" onPress={() => handleSubmit()} loading={loading} disabled={loading} style={styles.button}>
                  Iniciar sesión
                </Button>
                {error ? <Text style={styles.error}>{error}</Text> : null}
              </View>
            )}
          </Formik>
          <Text
            style={styles.link}
            onPress={() => Linking.openURL('https://www.themoviedb.org/reset-password')}
          >
            ¿Olvidaste tu contraseña?
          </Text>
          <Text
            style={styles.link}
            onPress={() => Linking.openURL('https://www.themoviedb.org/signup')}
          >
            Registrarse
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboard:{
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 200,
    marginBottom: 32,
  },
  formContainer: {
    width: '100%',
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
  },
  error: {
    color: 'red',
    marginTop: 8,
    textAlign: 'center',
  },
  link: {
    color: 'blue',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default LoginScreen;
