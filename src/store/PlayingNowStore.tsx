import { create } from 'zustand';
import { Movie } from '../@types';
import { getPlayingNowMovies } from '../services/Movie';

interface PlayingNowState {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  fetchPlayingNow: () => Promise<void>;
}

export const usePlayingNowStore = create<PlayingNowState>((set) => ({
  movies: [],
  loading: false,
  error: null,
  fetchPlayingNow: async () => {
    set({ loading: true, error: null });
    try {
      const movies = await getPlayingNowMovies();
      set({ movies, loading: false });
    } catch (error) {
      set({ error: 'Error fetching movies', loading: false });
    }
  },
}));