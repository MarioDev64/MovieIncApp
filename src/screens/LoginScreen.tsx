import React, { useState } from 'react';
import { View, StyleSheet, Linking, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('El nombre de usuario es requerido'),
  password: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es requerida'),
});

interface FormValues {
  username: string;
  password: string;
}

const LoginScreen: React.FC = () => {
  const { login, loading } = useAuth();
  const [error, setError] = useState('');

  const handleLogin = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    setError('');
    await login(values.username, values.password)
    .catch(err => {
      if(err.response.data.status_code === 30){
        setError('Credenciales inválidas. Correo Electrónico o Contraseña incorrectos.');
      }else{
        setError('Ha ocurrido un error inesperado.');
      }
    });
    setSubmitting(false);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.keyboard} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Image
            source={require('../assets/logo.jpeg')}
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
