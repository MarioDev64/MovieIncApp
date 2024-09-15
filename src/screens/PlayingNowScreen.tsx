import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import usePlayingNow from '../hooks/usePlayingNow';
import useFavoriteMovies from '../hooks/useFavoriteMovies';
import { StackNavigationProp } from '../@types';
import ErrorView from '../components/ErrorView';
import PlayingNowCard from '../components/PlayingNowCard';

const PlayingNowScreen: React.FC = () => {
  const { movies, loading: moviesLoading, error: moviesError } = usePlayingNow();
  const { isFavorite, loading: favoritesLoading, error: favoritesError, toggleFavorite, refetch: refetchFavorites } = useFavoriteMovies();
  const navigation = useNavigation<StackNavigationProp>();

  useFocusEffect(
    React.useCallback(() => {
      refetchFavorites();
    }, [refetchFavorites])
  );

  const handleMoviePress = (movieId: number) => {
    navigation.navigate('MovieDetail', { movieId });
  };
  
  if (moviesError || favoritesError) {
    return <ErrorView message={moviesError || favoritesError} />
  }

  return (
    <View style={styles.container}>
      {moviesLoading ? (
        <ActivityIndicator animating={true} size="large" />
      ) : (
        <ScrollView>
          {movies.map((movie) => (
            <PlayingNowCard
              key={movie.id}
              movie={movie}
              onPress={handleMoviePress}
              isFavorite={isFavorite(movie.id)}
              onToggleFavorite={toggleFavorite}
              favoritesLoading={favoritesLoading}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
});

export default PlayingNowScreen;