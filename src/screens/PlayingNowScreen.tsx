import React from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text, Card, Title, Paragraph, ActivityIndicator, IconButton } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import usePlayingNow from '../hooks/usePlayingNow';
import useFavoriteMovies from '../hooks/useFavoriteMovies';
import { getImageUrl, getVoteAverageColor, formatDate } from '../utils';
import { StackNavigationProp } from '../@types'; 

const PlayingNowScreen: React.FC = () => {
  const { movies, loading: moviesLoading, error: moviesError } = usePlayingNow();
  const { isFavorite, loading: favoritesLoading, error: favoritesError, toggleFavorite } = useFavoriteMovies();
  const navigation = useNavigation<StackNavigationProp>(); 

  const handleMoviePress = (movieId: number) => {
    navigation.navigate('MovieDetail', { movieId }); 
  };
  
  if (moviesError || favoritesError) {
    return (
      <View style={styles.centered}>
        <Text>Ups ha ocurrido un error inexperado</Text>
        <Text>{moviesError || favoritesError}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {moviesLoading ? (
        <ActivityIndicator animating={true} size="large" />
      ) : (
        <ScrollView>
          {movies.map((movie) => (
            <Card key={movie.id} style={styles.card}>
              <TouchableOpacity onPress={() => handleMoviePress(movie.id)}>
                <Card.Cover source={{ uri: getImageUrl(movie.poster_path) }} />
              </TouchableOpacity> 
              <Card.Content>
                <View style={styles.titleContainer}>
                  <Title>{movie.title}</Title>
                  <IconButton
                    icon={isFavorite(movie.id) ? 'heart' : 'heart-outline'}
                    onPress={() => toggleFavorite(movie.id)}
                    disabled={favoritesLoading}
                  />
                </View>
                <TouchableOpacity onPress={() => handleMoviePress(movie.id)}>
                  <View style={styles.release}>
                    <MaterialIcons name="update" size={16} color="gray" />
                    <Paragraph style={styles.releaseDateText}>{formatDate(movie.release_date)}</Paragraph>
                  </View>
                  <View style={styles.rating}>
                    <Text style={{color: "gray"}}>Vote avg:</Text>
                    <Paragraph style={{ color: getVoteAverageColor(movie.vote_average), marginLeft: 5, fontWeight: 'bold' }}>
                      {movie.vote_average.toFixed(2)}
                    </Paragraph>
                  </View>
                </TouchableOpacity>
              </Card.Content>
            </Card>
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  favoriteIndicator:{
    marginLeft: 8,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
  },
  release: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  releaseDateText: {
    marginLeft: 4,
    color: 'gray',
  },
});

export default PlayingNowScreen;