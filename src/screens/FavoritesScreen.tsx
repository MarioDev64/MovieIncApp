import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Dialog, Portal, Paragraph } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import useFavoriteMovies from '../hooks/useFavoriteMovies';
import { StackNavigationProp } from '../@types';
import FavoritesCard from '../components/FavoritesCard';
import Pagination from '../components/Pagination';
import ErrorView from '../components/ErrorView';

const FavoritesScreen: React.FC = () => {
  const {
    favorites,
    loading,
    error,
    toggleFavorite,
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    favoritesCount,
    refetch
  } = useFavoriteMovies();
  const navigation = useNavigation<StackNavigationProp>();
  const [dialogVisible, setDialogVisible] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handleMoviePress = (movieId: number) => {
    navigation.navigate('MovieDetail', { movieId });
  };

  const handleToggleFavorite = async (movieId: number) => {
    if (favoritesCount >= 20 && !favorites.some(movie => movie.id === movieId)) {
      setDialogVisible(true);
    } else {
      await toggleFavorite(movieId);
    }
  };

  if (error) {
    return <ErrorView message={error} />;
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator animating={true} size="large" />
      ) : (
        <>
          <ScrollView>
            {favorites.map((movie) => (
              <FavoritesCard
                key={movie.id}
                movie={movie}
                onPress={handleMoviePress}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={true}
                showFavoriteIcon={true}
              />
            ))}
          </ScrollView>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPreviousPage={goToPreviousPage}
              onNextPage={goToNextPage}
            />
          )}
        </>
      )}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Favorite Limit Reached</Dialog.Title>
          <Dialog.Content>
            <Paragraph>You've reached the maximum limit of 20 favorite movies. Remove a movie from your favorites to add a new one.</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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

export default FavoritesScreen;