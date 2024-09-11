import { axiosInstance } from './';

export const getUserProfile = async (sessionId: string) => {
    const response = await axiosInstance.get(`/account?session_id=${sessionId}`);
    return response.data;
};

export const toggleFavoriteMovie = async (movieId:number, favorite: boolean, accountId:string) => {
    const response = await axiosInstance.post(`/account/${accountId}/favorite`, {
      media_type: 'movie',
      media_id: movieId,
      favorite: favorite
    });
    return response.data;
};

export const getFavoritesMovies = async (accountId: string) => {
    const response = await axiosInstance.get(`/account/${accountId}/favorite/movies`);
    return response.data;
};

export const getRatedMovies = async (accountId: string) => {
    const response = await axiosInstance.get(`/account/${accountId}/rated/movies`);
    return response.data;
};
  