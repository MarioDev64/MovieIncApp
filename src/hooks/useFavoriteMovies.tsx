import { useState, useEffect, useCallback } from 'react';
import { toggleFavoriteMovie, getFavoritesMovies } from '../services/Account';
import { useAuth } from '../context/AuthContext';
import { Movie } from '../@types';

const FAVORITES_LIMIT = 20;
const ITEMS_PER_PAGE = 5;

const useFavoriteMovies = () => {
  const { accountId } = useAuth();
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchFavorites = useCallback(async (aid: string) => {
    setError(null);
    setLoading(true);

    try {
      const favoritesMovies = await getFavoritesMovies(aid);
      setFavorites(favoritesMovies.results.slice(0, FAVORITES_LIMIT));
      setTotalPages(Math.ceil(Math.min(favoritesMovies.results.length, FAVORITES_LIMIT) / ITEMS_PER_PAGE));
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
      setError('Failed to fetch favorites');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (accountId) {
      fetchFavorites(accountId);
    } else {
      setLoading(false);
    }
  }, [accountId, fetchFavorites]);

  const toggleFavorite = async (movieId: number) => {
    if (!accountId) {
      setError('No active account');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const isFavorite = favorites.some(movie => movie.id === movieId);
      if (!isFavorite && favorites.length >= FAVORITES_LIMIT) {
        setError('Favorite limit reached');
        setLoading(false);
        return;
      }

      await toggleFavoriteMovie(movieId, !isFavorite, accountId);
      await fetchFavorites(accountId);
    } catch (err) {
      console.error('Failed to toggle favorite status:', err);
      setError('Failed to update favorite status');
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = useCallback((movieId: number) => favorites.some(movie => movie.id === movieId), [favorites]);

  const getCurrentPageFavorites = useCallback(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return favorites.slice(startIndex, endIndex);
  }, [favorites, currentPage]);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const refetch = useCallback(() => {
    if (accountId) {
      fetchFavorites(accountId);
    }
  }, [accountId, fetchFavorites]);

  return {
    favorites: getCurrentPageFavorites(),
    loading,
    error,
    toggleFavorite,
    isFavorite,
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    favoritesCount: favorites.length,
    refetch,
  };
};

export default useFavoriteMovies;

