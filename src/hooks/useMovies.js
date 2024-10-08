import { useState, useEffect } from "react";
import { KEY } from "../helpers/Config";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();

      async function getMovies() {
        try {
          setError("");
          setIsLoading(true);

          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");

          console.log(data.Search.length);
          setMovies(data.Search);
          setError("");
        } catch (e) {
          setError(e.message);
        } finally {
          setIsLoading(false);
        }
      }
      if (!query.length) {
        setMovies([]);
        setError("");
        return;
      }

      getMovies();

      return () => {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
