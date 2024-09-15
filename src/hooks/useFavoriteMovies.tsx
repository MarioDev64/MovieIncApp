import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getFavoritesMovies, toggleFavoriteMovie } from '../services/Account';
import { Movie } from '../@types';

const ITEMS_PER_PAGE = 5;

const useFavoriteMovies = () => {
  const { user, accountId, sessionId } = useAuth();
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const fetchFavorites = useCallback(async () => {
    if (!accountId || !sessionId) return;
    setLoading(true);
    try {
      const response = await getFavoritesMovies(accountId, sessionId);
      setFavorites(response.results);
      setTotalResults(response.total_results);
      setTotalPages(Math.ceil(response.total_results / ITEMS_PER_PAGE));
    } catch (err) {
      setError('Error fetching favorites');
    } finally {
      setLoading(false);
    }
  }, [accountId, sessionId]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const toggleFavorite = useCallback(async (movieId: number) => {
    if (!accountId || !sessionId) return;
    try {
      const isFavorite = favorites.some(movie => movie.id === movieId);
      await toggleFavoriteMovie(movieId, !isFavorite, accountId, sessionId);
      await fetchFavorites();  // Refresh the list after toggling
    } catch (err) {
      setError('Error toggling favorite');
    }
  }, [accountId, sessionId, favorites, fetchFavorites]);

  const isFavorite = useCallback((movieId: number) => {
    return favorites.some(movie => movie.id === movieId);
  }, [favorites]);

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

  const paginatedFavorites = favorites.slice(
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
    favoritesCount: totalResults,
    refetch: fetchFavorites
  };
};

export default useFavoriteMovies;

