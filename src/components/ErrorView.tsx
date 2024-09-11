import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

interface ErrorViewProps {
  message: string;
}

const ErrorView: React.FC<ErrorViewProps> = ({ message }) => {
  return (
    <View style={styles.centered}>
      <Text>Oops, an unexpected error occurred</Text>
      <Text>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ErrorView;