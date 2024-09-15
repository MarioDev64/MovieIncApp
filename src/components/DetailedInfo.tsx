import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Chip } from 'react-native-paper';
import { Movie } from '../@types';

interface DetailedInfoProps {
  movie: Movie;
}

const DetailedInfo: React.FC<DetailedInfoProps> = ({ movie }) => {
  const releaseYear = movie.release_date?.split('-')[0] || '';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.releaseDate}>{releaseYear}</Text>
      <Text style={styles.overview}>{movie.overview}</Text>
      <View style={styles.genres}>
        {movie.genres?.map((genre) => (
          <Chip key={genre.id} style={styles.genreChip}>{genre.name}</Chip>
        )) || <Text>No genres available</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  releaseDate: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 16,
  },
  overview: {
    fontSize: 16,
    marginBottom: 16,
  },
  genres: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  genreChip: {
    margin: 4,
  },
});

export default DetailedInfo;