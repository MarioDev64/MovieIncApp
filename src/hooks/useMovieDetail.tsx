import { useState, useEffect, useCallback } from 'react';
import { getMovieDetails, rateMovie, getMovieRecommendations } from '../services/Movie';
import { getRatedMovies } from '../services/Account';
import { useAuth } from '../context/AuthContext';
import { Movie } from '../@types';

const useMovieDetail = (movieId: number) => {
  const { accountId } = useAuth();
  const [movieDetail, setMovieDetail] = useState<Movie | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [ratingLoading, setRatingLoading] = useState<boolean>(false);
  const [ratingError, setRatingError] = useState<string | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);

  const fetchMovieData = useCallback(async () => {
    if (!accountId) return;

    try {
      const [detailsResult, recommendationsResult, ratedMoviesResult] = await Promise.all([
        getMovieDetails(movieId),
        getMovieRecommendations(movieId),
        getRatedMovies(accountId)
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
  }, [movieId, accountId]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setUserRating(null);
    fetchMovieData();
  }, [movieId, fetchMovieData]);

  const submitRating = async (rating: number) => {
    if (!accountId) {
      setRatingError('No account ID available');
      return;
    }

    setRatingLoading(true);
    setRatingError(null);
    try {
      const apiRating = rating * 2; // Convert to 10-star scale for API
      await rateMovie(movieId, apiRating);
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
