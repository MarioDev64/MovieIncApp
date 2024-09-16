import { useEffect } from 'react';
import { useMovieStore } from '../store/MovieStore';

const usePlayingNowMovies = () => {
  const { playingNowMovies, loadPlayingNow } = useMovieStore();

  useEffect(() => {
    if (playingNowMovies.length === 0) {
      loadPlayingNow();
    }
  }, [loadPlayingNow, playingNowMovies.length]);

  return { 
    movies: playingNowMovies, 
    loading: playingNowMovies.length === 0, 
    error: null 
  };
};

export default usePlayingNowMovies;
