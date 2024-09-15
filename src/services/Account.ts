import { axiosInstance } from './';

export const getUserProfile = async (sessionId: string) => {
  try {
    const response = await axiosInstance.get('/account', {
      params: { session_id: sessionId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const toggleFavoriteMovie = async (movieId: number, favorite: boolean, accountId: string, sessionId: string) => {
  try {
    const response = await axiosInstance.post(`/account/${accountId}/favorite`, {
      media_type: 'movie',
      media_id: movieId,
      favorite: favorite
    }, {
      params: { session_id: sessionId }
    });
    return response.data;
  } catch (error) {
    console.error('Error toggling favorite movie:', error);
    throw error;
  }
};

export const getFavoritesMovies = async (accountId: string, sessionId: string, page: number = 1) => {
  try {
    const response = await axiosInstance.get(`/account/${accountId}/favorite/movies`, {
      params: {
        session_id: sessionId,
        page: page,
        sort_by: 'created_at.desc'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching favorite movies:', error);
    throw error;
  }
};

export const getRatedMovies = async (accountId: string, sessionId: string, page: number = 1) => {
  try {
    const response = await axiosInstance.get(`/account/${accountId}/rated/movies`, {
      params: {
        session_id: sessionId,
        page: page,
        sort_by: 'created_at.desc'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching rated movies:', error);
    throw error;
  }
};
  