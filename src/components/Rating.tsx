import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { Rating as KolkingRating } from '@kolking/react-native-rating';
import { getVoteAverageColor } from '../utils';

interface RatingProps {
  userRating: number | null;
  voteAverage: number;
  onRatingChange: (rating: number) => void;
  ratingLoading: boolean;
  ratingError: string | null;
}

const Rating: React.FC<RatingProps> = ({ 
  userRating, 
  voteAverage, 
  onRatingChange, 
  ratingLoading, 
  ratingError 
}) => {
  const displayRating = userRating !== null ? userRating * 2 : voteAverage;
  const ratingForDisplay = userRating !== null ? userRating : voteAverage / 2;

  return (
    <View style={styles.container}>
      <KolkingRating
        rating={ratingForDisplay}
        maxRating={5}
        size={28}
        onChange={onRatingChange}
      />
      <Text style={[styles.average, { color: getVoteAverageColor(displayRating) }]}>
        {displayRating.toFixed(2)}
      </Text>
      {ratingLoading && <ActivityIndicator size="small" style={styles.ratingIndicator} />}
      {ratingError && <Text style={styles.errorText}>{ratingError}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    marginLeft: 20,
  },
  average: {
    fontSize: 26,
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
});

export default Rating;