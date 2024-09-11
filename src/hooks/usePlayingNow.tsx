import { useEffect, useState } from 'react';
import { getPlayingNowMovies } from '../services/Movie';
import { Movie } from '../@types';

const usePlayingNowMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getMovies = async () => {
      try {
        const results = await getPlayingNowMovies();
        setMovies(results);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch movies');
        setLoading(false);
      }
    };

    getMovies();
  }, []);

  return { movies, loading, error };
};

export default usePlayingNowMovies;
