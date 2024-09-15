import React from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { Text, ActivityIndicator, Chip, ToggleButton, Card, Avatar } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Rating } from '@kolking/react-native-rating';
import useMovieDetail from '../hooks/useMovieDetail';
import useFavoriteMovie from '../hooks/useFavoriteMovie';
import Recommendations from '../components/Recommendations';
import { getImageUrl, getVoteAverageColor } from '../utils';
import { StackNavigationProp } from '../@types';

const MovieDetailScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation<StackNavigationProp>();
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
    return (
      <View style={styles.centered}>
        <Text>{movieError || favoriteError}</Text>
      </View>
    );
  }

  const posterUrl = movieDetail?.poster_path ? getImageUrl(movieDetail.poster_path, "300") : '';
  const releaseYear = movieDetail?.release_date?.split('-')[0] || '';
  const displayRating = userRating !== null ? userRating * 2 : (movieDetail?.vote_average ?? 0);
  const ratingForDisplay = userRating !== null ? userRating : (movieDetail?.vote_average ?? 0) / 2;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.posterContainer}>
        <Image source={{ uri: posterUrl }} style={styles.poster} />
        <View style={styles.favoriteButtonContainer}>
          <ToggleButton
            icon={isFavorite ? 'heart' : 'heart-outline'}
            status={isFavorite ? 'checked' : 'unchecked'}
            onPress={() => toggleFavorite()}
            style={styles.favoriteButton}
            disabled={favoriteLoading}
          />
          {favoriteError && <Text style={styles.errorText}>{favoriteError}</Text>}
        </View>
      </View>
      <Text style={styles.title}>{movieDetail?.title}</Text>
      <Text style={styles.releaseDate}>{releaseYear}</Text>
      <Text style={styles.overview}>{movieDetail?.overview}</Text>
      <View style={styles.genres}>
        {movieDetail?.genres?.map((genre) => (
          <Chip key={genre.id} style={styles.genreChip}>{genre.name}</Chip>
        )) || <Text>No genres available</Text>}
      </View>
      <View style={styles.ratingContainer}>
        <Rating
          rating={ratingForDisplay}
          maxRating={5}
          size={28}
          onChange={submitRating}
        />
        <Text style={[styles.average, { color: getVoteAverageColor(displayRating) }]}>
          {displayRating.toFixed(2)}
        </Text>
        {ratingLoading && <ActivityIndicator size="small" style={styles.ratingIndicator} />}
        {ratingError && <Text style={styles.errorText}>{ratingError}</Text>}
      </View>
      
      <Text style={styles.sectionTitle}>Cast</Text>
      <ScrollView horizontal style={styles.castContainer}>
        {movieDetail?.credits?.cast.slice(0, 10).map((actor) => (
          <Card key={actor.id} style={styles.castCard}>
            <Card.Content>
              <Avatar.Image 
                size={80} 
                source={{ uri: actor.profile_path ? getImageUrl(actor.profile_path, "200") : 'https://via.placeholder.com/200' }} 
              />
              <Text style={styles.actorName}>{actor.name}</Text>
              <Text style={styles.characterName}>{actor.character}</Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

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
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  favoriteIndicator: {
    marginLeft: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginHorizontal: 16,
  },
  releaseDate: {
    fontSize: 16,
    color: 'gray',
    marginTop: 8,
    marginHorizontal: 16,
  },
  overview: {
    fontSize: 16,
    marginTop: 16,
    marginHorizontal: 16,
  },
  genres: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
    marginHorizontal: 16,
  },
  genreChip: {
    margin: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  average:{
    fontSize: 26,
    marginTop: 5,
    marginLeft: 10,
    fontWeight: "bold",
  },
  ratingIndicator: {
    marginLeft: 8,
  },
  errorText: {
    color: 'red',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginHorizontal: 16,
  },
  castContainer: {
    marginTop: 8,
    marginHorizontal: 16,
  },
  castCard: {
    width: 120,
    marginRight: 8,
  },
  actorName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  characterName: {
    fontSize: 12,
    color: 'gray',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default MovieDetailScreen;
