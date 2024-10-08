import { useEffect, useRef, useState } from "react";
import { APP_NAME, KEY } from "../helpers/Config.js";
import StarRating from "./StarRating.js";
import Loader from "./Loader.js";
import { useKey } from "../hooks/useKey.js";

export default function MovieDetails({
  selectedMovieId,
  onCloseMovie,
  onAddWatched,
  existingRating,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(existingRating);

  const countRef = useRef(0);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  useEffect(
    function () {
      if (userRating) {
        countRef.current = countRef.current + 1;
      }

      console.log(countRef.current);
    },
    [userRating]
  );

  function handleSetRating(value) {
    setUserRating(value);
  }

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedMovieId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRatingDecisions: countRef.current,
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  useKey("Escape", onCloseMovie);

  useEffect(
    function () {
      async function getMovieDetails() {
        try {
          setIsLoading(true);

          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedMovieId}`
          );

          if (!res.ok)
            throw new Error("Something went wrong when fetching movie data");

          const data = await res.json();

          setMovie(data);
        } catch (e) {
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      }
      getMovieDetails();
    },
    [selectedMovieId]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `MOVIE | ${title}`;

      return () => {
        document.title = APP_NAME;
      };
    },
    [title]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              ⬅
            </button>
            <img src={poster} alt={`Poster of ${movie}`} />

            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              <StarRating
                maxRating={10}
                size={26}
                defaultRating={existingRating}
                onSetRating={handleSetRating}
              />
            </div>
            {userRating > 0 && !(existingRating > 0) && (
              <button className="btn-add" onClick={() => handleAdd()}>
                + Add to list
              </button>
            )}
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
