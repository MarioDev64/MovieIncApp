import { create } from 'zustand';
import { Movie } from '../@types';
import { getFavoritesMovies, getRatedMovies } from '../services/Account';
import { getPlayingNowMovies } from '../services/Movie';
import { MovieStore } from '../@types'



export const useMovieStore = create<MovieStore>((set) => ({
  favoriteMovies: [],
  ratedMovies: [],
  playingNowMovies: [],
  loadFavorites: async (accountId, sessionId) => {
    const response = await getFavoritesMovies(accountId, sessionId);
    set({ favoriteMovies: response.results });
  },
  loadRated: async (accountId, sessionId) => {
    const response = await getRatedMovies(accountId, sessionId);
    set({ ratedMovies: response.results });
  },
  loadPlayingNow: async () => {
    const movies = await getPlayingNowMovies();
    set({ playingNowMovies: movies });
  },
  addFavorite: (movie) => set((state) => ({
    favoriteMovies: [...state.favoriteMovies, movie]
  })),
  removeFavorite: (movieId) => set((state) => ({
    favoriteMovies: state.favoriteMovies.filter((movie) => movie.id !== movieId)
  })),
  setRating: (movieId, rating) => set((state) => ({
    ratedMovies: state.ratedMovies.map((movie) =>
      movie.id === movieId ? { ...movie, rating } : movie
    )
  })),
  clearStore: () => set(() => ({
    favoriteMovies: [],
    ratedMovies: [],
    playingNowMovies: []
  }))
}));