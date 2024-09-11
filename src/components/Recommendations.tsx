import React from 'react';
import { View, StyleSheet, Dimensions, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { getImageUrl } from '../utils';
import { Movies } from '../@types';

interface RecommendationsCarouselProps {
  recommendations: Movies[];
  onMoviePress: (movieId: number) => void;
}

const { width: screenWidth } = Dimensions.get('window');
const ITEM_WIDTH = screenWidth * 0.4;
const ITEM_HEIGHT = ITEM_WIDTH * 1.5;

const RecommendationsCarousel: React.FC<RecommendationsCarouselProps> = ({ recommendations, onMoviePress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Películas Similares o Recomendadas</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
      >
        {recommendations.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => onMoviePress(item.id)}
            style={styles.itemContainer}
          >
            <Image
              source={{ uri: getImageUrl(item.poster_path, '200') }}
              style={styles.poster}
            />
            <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 16,
  },
  scrollViewContent: {
    paddingHorizontal: 8,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  poster: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    borderRadius: 8,
  },
  title: {
    marginTop: 5,
    textAlign: 'center',
    width: ITEM_WIDTH,
  },
});

export default RecommendationsCarousel;