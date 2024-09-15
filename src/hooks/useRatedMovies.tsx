import { useState, useEffect, useCallback } from 'react';
import { getRatedMovies } from '../services/Account';
import { rateMovie } from '../services/Movie';
import { useAuth } from '../context/AuthContext';

const useRatedMovie = (movieId: number) => {
  const { accountId, sessionId } = useAuth();
  const [userRating, setUserRating] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const checkRatingStatus = useCallback(async (aid: string, id: number) => {
    setError(null);
    setLoading(true);

    try {
      const ratedMoviesResult = await getRatedMovies(aid);
      const ratedMovie = ratedMoviesResult.results.find((movie: { id: number; }) => movie.id === id);
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
  }, []);

  useEffect(() => {
    if (accountId && sessionId) {
      checkRatingStatus(accountId, movieId);
    } else {
      setLoading(false);
    }
  }, [movieId, accountId, sessionId, checkRatingStatus]);

  const submitRating = async (rating: number) => {
    if (!accountId || !sessionId) {
      setError('No account ID or session ID available');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const apiRating = rating * 2; // Convert to 10-star scale for API
      await rateMovie(movieId, apiRating, sessionId);
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