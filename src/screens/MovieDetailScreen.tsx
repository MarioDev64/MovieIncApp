import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import useMovieDetail from '../hooks/useMovieDetail';
import useFavoriteMovie from '../hooks/useFavoriteMovie';
import Recommendations from '../components/Recommendations';
import MoviePoster from '../components/Poster';
import DetailedInfo from '../components/DetailedInfo';
import Rating from '../components/Rating';
import Casting from '../components/Casting';
import ErrorView from '../components/ErrorView';
import { RootStackNavigationProp } from '../@types';

const MovieDetailScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation<RootStackNavigationProp>();
  const { movieId } = route.params as { movieId: number };
  const { 
    movieDetail, 
    recommendations, 
    loading: movieLoading, 
    error: movieError, 
    submitRating, 
    ratingLoading, 
    ratingError,
    userRating 
  } = useMovieDetail(movieId);
  const { isFavorite, loading: favoriteLoading, error: favoriteError, toggleFavorite } = useFavoriteMovie(movieId);

  const handleMoviePress = (newMovieId: number) => {
    navigation.push('MovieDetail', { movieId: newMovieId });
  };

  if (movieLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (movieError || favoriteError) {
    return <ErrorView  message={movieError || favoriteError}/>
  }

  if (!movieDetail) {
    return null;
  }

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}>
      <MoviePoster 
        posterPath={movieDetail.poster_path}
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
        favoriteLoading={favoriteLoading}
      />
      <DetailedInfo movie={movieDetail} />
      <Rating 
        userRating={userRating}
        voteAverage={movieDetail.vote_average}
        onRatingChange={submitRating}
        ratingLoading={ratingLoading}
        ratingError={ratingError}
      />
      {movieDetail.credits && <Casting cast={movieDetail.credits.cast} />}
      <Recommendations
        recommendations={recommendations}
        onMoviePress={handleMoviePress}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MovieDetailScreen;
