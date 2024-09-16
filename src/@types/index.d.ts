import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp } from '@react-navigation/native';

export type RootTabParamList = {
  PlayingNow: undefined;
  Favorites: undefined;
  Profile: undefined;
};

export type AuthStackParamList = {
  Login: { isReturningFromApproval?: boolean; requestToken?: string };
  Approval: { requestToken: string };
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  MovieDetail: { movieId: number };
};

export type BottomTabNavigationProp = BottomTabNavigationProp<RootTabParamList>;
export type AuthStackNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type ScreenProps = {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp,
    CompositeNavigationProp<
      AuthStackNavigationProp,
      RootStackNavigationProp
    >
  >;
};

export interface UserProfile {
  avatar: {
    gravatar: {
      hash: string;
    };
    tmdb: {
      avatar_path: string | null;
    };
  };
  id: number;
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  include_adult: boolean;
  username: string;
}

interface genres {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  vote_average: number;
  poster_path: string;
  release_date: string;
  overview: string;
  rating: number;
  genres: genres[];
}

interface MovieStore {
  favoriteMovies: Movie[];
  ratedMovies: Movie[];
  playingNowMovies: Movie[];
  loadFavorites: (accountId: string, sessionId: string) => Promise<void>;
  loadRated: (accountId: string, sessionId: string) => Promise<void>;
  loadPlayingNow: () => Promise<void>;
  addFavorite: (movie: Movie) => void;
  removeFavorite: (movieId: number) => void;
  setRating: (movieId: number, rating: number) => void;
  clearStore: () => void;
}