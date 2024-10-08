import { useState } from "react";
import NavBar from "./components/NavBar";
import Menu from "./components/Menu.js";
import NumResults from "./components/NumResults.js";
import Logo from "./components/Logo.js";
import Search from "./components/Search.js";
import Box from "./components/Box.js";
import MovieList from "./components/MovieList.js";
import WatchedSummary from "./components/WatchedSummary.js";
import WatchedMoviesList from "./components/WatchedMoviesList.js";
import Loader from "./components/Loader.js";
import ErrorMessage from "./components/ErrorMessage.js";
import MovieDetails from "./components/MovieDetails.js";
import { useMovies } from "./hooks/useMovies.js";
import { useLocalStorageState } from "./hooks/useLocalStorageState.js";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovies(query);

  const [watched, setWatched] = useLocalStorageState([], "watched");

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults num={movies.length} />
      </NavBar>

      <Menu>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList onSelectMovie={handleSelectMovie} movies={movies} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedMovieId={selectedId}
              existingRating={
                watched.find((movie) => movie.imdbID === selectedId)?.userRating
              }
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                onDeleteWatchedMovie={handleDeleteWatched}
                watched={watched}
              />
            </>
          )}
        </Box>
      </Menu>
    </>
  );
}
