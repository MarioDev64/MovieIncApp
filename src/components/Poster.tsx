import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { ToggleButton } from 'react-native-paper';
import { getImageUrl } from '../utils';

interface PosterProps {
  posterPath: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  favoriteLoading: boolean;
}

const Poster: React.FC<PosterProps> = ({ posterPath, isFavorite, onToggleFavorite, favoriteLoading }) => {
  const posterUrl = posterPath ? getImageUrl(posterPath, "300") : '';

  return (
    <View style={styles.posterContainer}>
      <Image source={{ uri: posterUrl }} style={styles.poster} />
      <View style={styles.favoriteButtonContainer}>
        <ToggleButton
          icon={isFavorite ? 'heart' : 'heart-outline'}
          status={isFavorite ? 'checked' : 'unchecked'}
          onPress={onToggleFavorite}
          style={styles.favoriteButton}
          disabled={favoriteLoading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  posterContainer: {
    position: 'relative',
    width: '100%',
    height: 500,
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  favoriteButtonContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  favoriteButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});

export default Poster;