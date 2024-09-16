import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toggleFavoriteMovie } from '../services/Account';
import { useMovieStore } from '../store/MovieStore';

const ITEMS_PER_PAGE = 5;

const useFavoriteMovies = () => {
  const { accountId, sessionId } = useAuth();
  const { favoriteMovies, playingNowMovies, loadFavorites, addFavorite, removeFavorite } = useMovieStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchFavorites = useCallback(async () => {
    if (!accountId || !sessionId) return;
    setLoading(true);
    try {
      await loadFavorites(accountId, sessionId);
      setTotalPages(Math.ceil(favoriteMovies.length / ITEMS_PER_PAGE));
    } catch (err) {
      setError('Error fetching favorites');
    } finally {
      setLoading(false);
    }
  }, [accountId, sessionId, loadFavorites, favoriteMovies.length]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const toggleFavorite = useCallback(async (movieId: number) => {
    if (!accountId || !sessionId) return;
    try {
      const isFavorite = favoriteMovies.some(movie => movie.id === movieId);
      await toggleFavoriteMovie(movieId, !isFavorite, accountId, sessionId);
      if (isFavorite) {
        removeFavorite(movieId);
      } else {
        const movieToAdd = playingNowMovies.find(movie => movie.id === movieId);
        if (movieToAdd) addFavorite(movieToAdd);
      }
    } catch (err) {
      setError('Error toggling favorite');
    }
  }, [accountId, sessionId, favoriteMovies, addFavorite, removeFavorite]);

  const isFavorite = useCallback((movieId: number) => {
    return favoriteMovies.some(movie => movie.id === movieId);
  }, [favoriteMovies]);

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);

  const goToPreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  const paginatedFavorites = favoriteMovies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return {
    favorites: paginatedFavorites,
    loading,
    error,
    toggleFavorite,
    isFavorite,
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    favoritesCount: favoriteMovies.length,
    refetch: fetchFavorites
  };
};

export default useFavoriteMovies;