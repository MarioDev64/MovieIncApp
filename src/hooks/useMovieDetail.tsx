import { useState, useEffect, useCallback } from 'react';
import { getMovieDetails, rateMovie, getMovieRecommendations } from '../services/Movie';
import { getRatedMovies } from '../services/Account';
import { useAuth } from '../context/AuthContext';
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
  const [ratingLoading, setRatingLoading] = useState<boolean>(false);
  const [ratingError, setRatingError] = useState<string | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);

  const fetchMovieData = useCallback(async () => {
    if (!accountId || !sessionId) return;

    try {
      const [detailsResult, recommendationsResult, ratedMoviesResult] = await Promise.all([
        getMovieDetails(movieId),
        getMovieRecommendations(movieId),
        getRatedMovies(accountId, sessionId)
      ]);

      const ratedMovie = ratedMoviesResult.results.find((movie: { id: number; }) => movie.id === movieId);
      if (ratedMovie) {
        setUserRating(ratedMovie.rating / 2); // Convert to 5-star scale
      } else {
        setUserRating(null);
      }

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
    setUserRating(null);
    fetchMovieData();
  }, [movieId, fetchMovieData]);

  const submitRating = async (rating: number) => {
    if (!accountId || !sessionId) {
      setRatingError('No account ID or session ID available');
      return;
    }

    setRatingLoading(true);
    setRatingError(null);
    try {
      const apiRating = rating * 2; // Convert to 10-star scale for API
      await rateMovie(movieId, apiRating, sessionId);
      setUserRating(rating);
    } catch (err) {
      setRatingError('Failed to submit rating');
    } finally {
      setRatingLoading(false);
    }
  };

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
