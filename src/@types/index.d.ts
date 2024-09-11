import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootTabParamList = {
  PlayingNow: undefined;
  Favorites: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  MovieDetail: undefined; 
};

export type BottomTabNavigationProp = BottomTabNavigationProp<RootTabParamList>;
export type StackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export interface ScreenProps {
  navigation: BottomTabNavigationProp | StackNavigationProp;
}

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

interface genres{
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
  genres: genres[];
}