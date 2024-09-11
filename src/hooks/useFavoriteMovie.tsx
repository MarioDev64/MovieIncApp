import { useState, useEffect, useCallback } from 'react';
import { toggleFavoriteMovie, getFavoritesMovies } from '../services/Account';
import { useAuth } from '../context/AuthContext';

const useFavoriteMovie = (movieId: number) => {
  const { accountId } = useAuth();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const checkFavoriteStatus = useCallback(async (aid: string, id: number) => {
    setError(null);
    setLoading(true);

    try {
      const favoritesMovies = await getFavoritesMovies(aid);
      const isFav = favoritesMovies.results.some((movie: any) => movie.id === id);
      setIsFavorite(isFav);
    } catch (err) {
      console.error('Failed to check favorite status:', err);
      setError('Failed to check favorite status');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (accountId) {
      checkFavoriteStatus(accountId, movieId);
    } else {
      setLoading(false);
    }
  }, [movieId, accountId, checkFavoriteStatus]);

  const toggleFavorite = async () => {
    if (!accountId) {
      setError('No active account');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const newFavoriteStatus = !isFavorite;
      await toggleFavoriteMovie(movieId, newFavoriteStatus, accountId);
      setIsFavorite(newFavoriteStatus);
    } catch (err) {
      console.error('Failed to toggle favorite status:', err);
      setError('Failed to update favorite status');
    } finally {
      setLoading(false);
    }
  };

  return { isFavorite, loading, error, toggleFavorite };
};

export default useFavoriteMovie;