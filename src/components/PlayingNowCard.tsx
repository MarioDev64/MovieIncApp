import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, IconButton } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { getImageUrl, getVoteAverageColor, formatDate } from '../utils';
import { Movie } from '../@types';

interface PlayingNowCardProps {
  movie: Movie;
  onPress: (movieId: number) => void;
  isFavorite: boolean;
  onToggleFavorite: (movieId: number) => void;
  favoritesLoading: boolean;
}

const PlayingNowCard: React.FC<PlayingNowCardProps> = ({
  movie,
  onPress,
  isFavorite,
  onToggleFavorite,
  favoritesLoading
}) => {
  return (
    <Card style={styles.card}>
      <TouchableOpacity onPress={() => onPress(movie.id)}>
        <Card.Cover style={styles.poster}source={{ uri: getImageUrl(movie.poster_path) }} />
      </TouchableOpacity>
      <Card.Content>
        <View style={styles.titleContainer}>
          <Title>{movie.title}</Title>
          <IconButton
            icon={isFavorite ? 'heart' : 'heart-outline'}
            onPress={() => onToggleFavorite(movie.id)}
            disabled={favoritesLoading}
          />
        </View>
        <TouchableOpacity onPress={() => onPress(movie.id)}>
          <View style={styles.release}>
            <MaterialIcons name="update" size={16} color="gray" />
            <Paragraph style={styles.releaseDateText}>{formatDate(movie.release_date)}</Paragraph>
          </View>
          <View style={styles.rating}>
            <Paragraph style={{ color: "gray" }}>Vote avg:</Paragraph>
            <Paragraph style={{ color: getVoteAverageColor(movie.vote_average), marginLeft: 5, fontWeight: 'bold' }}>
              {movie.vote_average.toFixed(2)}
            </Paragraph>
          </View>
        </TouchableOpacity>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  poster:{
    borderBottomStartRadius: 0,
    borderBottomEndRadius: 0,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

export default PlayingNowCard;