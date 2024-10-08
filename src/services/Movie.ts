import { axiosInstance } from './';

export const getPlayingNowMovies = async () => {
  const response = await axiosInstance.get('/movie/now_playing');
  const sortedMovies = response.data.results.sort((a: any, b: any) =>
    a.title.localeCompare(b.title)
  );
  return sortedMovies;
};
  
export const getMovieDetails = async (movieId: number) => {
  const response = await axiosInstance.get(`/movie/${movieId}?append_to_response=credits`);
  return response.data;
};
  
export const rateMovie = async (movieId: number, rating: number, sessionId:string) => {
  const response = await axiosInstance.post(`/movie/${movieId}/rating?session_id=${sessionId}`, {
    value: rating,
  });
  return response.data;
};

export const getMovieRecommendations = async (movieId: number) => {
  const response = await axiosInstance.get(`/movie/${movieId}/recommendations`);
  return response.data;
};