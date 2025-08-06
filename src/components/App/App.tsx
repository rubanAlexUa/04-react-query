import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
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
  const [query, setQuery] = useState<string>("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["movie", query, page],
    queryFn: () => fetchMovie(query, page),
    enabled: query.trim() !== "",
    placeholderData: keepPreviousData,
  });

  const totalPages: number = data?.total_pages ?? 0;
  useEffect(() => {
    if (!data) return;
    if (data.results.length === 0)
      toast.error("No movies found for your request");
  }, [data]);
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
    setQuery(query);
    setPage(1);
  }

  return (
    <div className={c.app}>
      <SearchBar onSubmit={handleSearch} />
      {totalPages !== 0 && isSuccess && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={c.pagination}
          activeClassName={c.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {query !== " " && isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {data?.results.length !== 0 && isSuccess && (
        <MovieGrid movies={data?.results} onSelect={openModal} />
      )}
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={onClose} />}
      <Toaster />
    </div>
  );
}
