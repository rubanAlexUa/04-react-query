import axios from "axios";
import type { Movie } from "../types/movie";

const token = import.meta.env.VITE_TMDB_TOKEN;

interface MoviesHttpResponse {
  page: number;
  total_pages: number;
  results: Movie[];
}

export const fetchMovie = async (
  query: string,
  page: number
): Promise<MoviesHttpResponse> => {
  const response = await axios.get<MoviesHttpResponse>(
    `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US`,
    {
      params: {
        page,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
