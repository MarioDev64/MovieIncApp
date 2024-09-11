import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { IconButton } from 'react-native-paper';
import { useAuth } from '../context/AuthContext'; 
import { RootStackParamList, RootTabParamList } from '../@types';

import LoginScreen from '../screens/LoginScreen';
import PlayingNowScreen from '../screens/PlayingNowScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MovieDetailScreen from '../screens/MovieDetailScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const MainNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="PlayingNow"
        component={PlayingNowScreen}
        options={{
            tabBarIcon: ({ color, size }) => (
              <IconButton icon="play" iconColor={color} size={size} />
            ),
            title: "Reproduciendo Ahora"
          }
        }
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <IconButton icon="heart" iconColor={color} size={size} />
          ),
          title: "Mis Favoritos"
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <IconButton icon="account" iconColor={color} size={size} />
          ),
          title: "Mi Perfil"
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <>
          <Stack.Screen name="Main" component={MainNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="MovieDetail" component={MovieDetailScreen} options={{ title: 'Detalle de película' }} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  }
});

export default AppNavigator;