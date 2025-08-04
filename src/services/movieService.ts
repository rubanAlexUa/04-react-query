import axios from "axios";
import type { Movie } from "../types/movie";

const token = import.meta.env.VITE_TMDB_TOKEN;

interface MoviesHttpResponse {
  results: Movie[];
}

export const fetchMovie = async (topic: string) => {
  if (!topic) return;
  return await axios.get<MoviesHttpResponse>(
    `https://api.themoviedb.org/3/search/movie?query=${topic}&include_adult=false&language=en-US`,
    {
      params: {
        page: 1,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
