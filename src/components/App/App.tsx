import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import c from "./App.module.css";
import { fetchMovie } from "../../services/movieService";
import type { Movie } from "../../types/movie";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [topic, setTopic] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchResponse() {
      if (topic === "") return;
      try {
        setMovies([]);
        setIsLoading(true);
        setIsError(false);
        const responce = await fetchMovie(topic);
        if (responce.length === 0) {
          toast.error("No movies found for your request.");
          setMovies([]);
          return;
        }
        setMovies(responce);
      } catch (error) {
        setIsLoading(false);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchResponse();
  }, [topic]);

  useEffect(() => {
    console.log("Now article is: ", movies);
  }, [movies]);
  useEffect(() => {
    console.log("Modal is " + (isModalOpen ? "Opened" : "Closed"));
  }, [isModalOpen]);
  useEffect(() => {
    console.log("Info movie for modal: ", selectedMovie);
  }, [selectedMovie]);

  function openModal(infoMovie: Movie) {
    setSelectedMovie(infoMovie);
    setIsModalOpen(true);
  }

  function onClose() {
    setIsModalOpen(false);
    setSelectedMovie(null);
  }

  return (
    <div className={c.app}>
      <SearchBar onSubmit={setTopic} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      <MovieGrid movies={movies} onSelect={openModal} />
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={onClose} />}
      <Toaster />
    </div>
  );
}
