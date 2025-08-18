import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  if (!isLoading) return null;
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#E53935" />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

export default LoadingScreen;
