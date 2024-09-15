import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';

export default function App(): React.JSX.Element {
  return (
    <PaperProvider >
      <NavigationContainer >
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </NavigationContainer>
    </PaperProvider>
  );
}