import { useState, useEffect, useCallback } from 'react';
import { rateMovie } from '../services/Movie';
import { useAuth } from '../context/AuthContext';
import { useMovieStore } from '../store/MovieStore';

const useRatedMovie = (movieId: number) => {
  const { accountId, sessionId } = useAuth();
  const { ratedMovies, loadRated, setRating } = useMovieStore();
  const [userRating, setUserRating] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkRatingStatus = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      if (ratedMovies.length === 0) {
        await loadRated(accountId!, sessionId!);
      }
      const ratedMovie = ratedMovies.find((movie) => movie.id === movieId);
      if (ratedMovie) {
        setUserRating(ratedMovie.rating / 2); // Convert to 5-star scale
      } else {
        setUserRating(null);
      }
    } catch (err) {
      console.error('Failed to check rating status:', err);
      setError('Failed to check rating status');
    } finally {
      setLoading(false);
    }
  }, [accountId, sessionId, movieId, ratedMovies, loadRated]);

  useEffect(() => {
    if (accountId && sessionId) {
      checkRatingStatus();
    } else {
      setLoading(false);
    }
  }, [accountId, sessionId, checkRatingStatus]);

  const submitRating = async (rating: number) => {
    if (!accountId || !sessionId) {
      setError('No account ID or session ID available');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const rate = rating * 2; // Convert to 10-star scale for API
      await rateMovie(movieId, rate, sessionId);
      setRating(movieId, rate);
      setUserRating(rating);
    } catch (err) {
      console.error('Failed to submit rating:', err);
      setError('Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  return { userRating, loading, error, submitRating };
};

export default useRatedMovie;