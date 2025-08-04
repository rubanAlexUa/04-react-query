import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";
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
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["movie"],
    queryFn: () => fetchMovie(topic),
    enabled: topic.trim() !== "",
  });

  const totalPages: number = data?.data?.total_pages ?? 0;
  useEffect(() => {
    if (!data) return;
    if (data.data.results.length === 0)
      toast.error("No movies found for your request");
    setMovies(data.data.results);
  }, [data]);
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

  function handleSearch(query: string) {
    setTopic(query);
    setCurrentPage(1);
  }

  return (
    <div className={c.app}>
      <SearchBar onSubmit={handleSearch} />
      {totalPages !== 0 && isSuccess && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={c.pagination}
          activeClassName={c.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      <MovieGrid movies={movies} onSelect={openModal} />
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={onClose} />}
      <Toaster />
    </div>
  );
}
