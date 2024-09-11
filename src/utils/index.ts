import { UserProfile, Movie } from '../@types';
import moment from "moment";

export const getAvatarUrl = (user: UserProfile): string => {
    const { gravatar, tmdb } = user.avatar;
    if (tmdb.avatar_path) {
      return `https://image.tmdb.org/t/p/w200/${tmdb.avatar_path}.png`;
    } else {
      return `https://secure.gravatar.com/avatar/${gravatar.hash}.jpg`;
    }
};

export const getImageUrl = (imagePath: string, size?: string): string => {
    if(size){
        return `https://image.tmdb.org/t/p/w${size}/${imagePath}`;
    }
    return `https://image.tmdb.org/t/p/original/${imagePath}`;
}

export const getVoteAverageColor = (vote: number): string => {
    if (vote < 5) return '#cc3232';
    if (vote >= 5 && vote < 7) return '#e7b416';
    return '#99c140';
};

export const isFavoriteMovie = (movieId: number, favoriteMovies:Movie[]): boolean => {
  const isFavorite = favoriteMovies.find((movie: Movie) => movie.id === movieId);
  return !!isFavorite;
}

export const formatDate = (date:string) => {
  return moment(date).format("MMMM D, YYYY");
} 