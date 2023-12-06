import { useEffect, useState } from "react";
import config from "../config";

const KEY = config.KEY;

export const useMovies = (query) => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controler = new AbortController();

    const fetchData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controler.signal }
        );

        if (!res.ok) throw new Error("Something went wrong with fetching Data");

        const data = await res.json();
        if (data.Response === "False") throw new Error(" Movie not found");

        setMovies(data.Search);
        // setError("");
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      setIsLoading(false);
    };
    fetchData();

    return () => {
      controler.abort();
    };
  }, [query]);

  return { movies, isLoading, error };
};
