import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, ScrollView } from 'react-native';
import { Avatar, Text, Button, ActivityIndicator, Chip } from 'react-native-paper';
import { useFadeIn } from '../hooks/useFadeIn';
import { getAvatarUrl } from '../utils';
import { useAuth } from '../context/AuthContext';

const ProfileScreen: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const fadeInAnim = useFadeIn();

  useEffect(() => {
    if (user) {
      Animated.timing(fadeInAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>No se ha podido cargar el perfil del usuario.</Text>
        <Button mode="contained" onPress={handleLogout} style={styles.button}>
          Cerrar sesión
        </Button>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Animated.View style={[styles.profileContainer, { opacity: fadeInAnim }]}>
        <Avatar.Image 
          size={120} 
          source={{ uri: getAvatarUrl(user) }} 
          style={styles.avatar} 
        />
        <Text style={styles.username}>{user.username}</Text>
        {user.name && <Text style={styles.name}>{user.name}</Text>}
        
        <View style={styles.infoContainer}>
          <InfoItem label="País" value={user.iso_3166_1} />
          <InfoItem label="Idioma" value={user.iso_639_1} />
        </View>

        <Chip style={styles.chip}>ID: {user.id}</Chip>
      </Animated.View>
      
      <Button 
        mode="contained" 
        onPress={handleLogout} 
        style={styles.button}
      >
        Cerrar sesión
      </Button>
    </ScrollView>
  );
};

const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  profileContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatar: {
    marginBottom: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  infoContainer: {
    width: '100%',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  chip: {
    marginTop: 16,
  },
  button: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
});

export default ProfileScreen;