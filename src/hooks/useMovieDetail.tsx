import { useState, useEffect, useCallback } from 'react';
import { getMovieDetails, getMovieRecommendations } from '../services/Movie';
import { useAuth } from '../context/AuthContext';
import useRatedMovie from '../hooks/useRatedMovie';
import { Movie } from '../@types';

interface MovieWithCredits extends Movie {
  credits?: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }>;
  };
}

const useMovieDetail = (movieId: number) => {
  const { accountId, sessionId } = useAuth();
  const [movieDetail, setMovieDetail] = useState<MovieWithCredits | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { userRating, loading: ratingLoading, error: ratingError, submitRating } = useRatedMovie(movieId);

  const fetchMovieData = useCallback(async () => {
    if (!accountId || !sessionId) return;

    try {
      const [detailsResult, recommendationsResult] = await Promise.all([
        getMovieDetails(movieId),
        getMovieRecommendations(movieId),
      ]);

      setMovieDetail(detailsResult);
      setRecommendations(recommendationsResult.results);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch movie data');
      setLoading(false);
    }
  }, [movieId, accountId, sessionId]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchMovieData();
  }, [movieId, fetchMovieData]);

  return { 
    movieDetail, 
    recommendations, 
    loading, 
    error, 
    submitRating, 
    ratingLoading, 
    ratingError,
    userRating 
  };
};

export default useMovieDetail;
