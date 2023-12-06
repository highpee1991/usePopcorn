import { useState } from "react";
import { useMovies } from "./customHooks/useMovies";
import useLocalStorage from "./customHooks/useLocalStorage";
import { LogoMenu } from "./components/logoMenu";
import { Main } from "./components/main";
import { SearchResultCounter } from "./components/searchAndResult";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedID, setSelectedId] = useState(null);

  // custom hooks
  const { movies, isLoading, error } = useMovies(query);
  const { watched, setWatched } = useLocalStorage([], "watched");

  const closeMovieDetail = () => {
    setSelectedId(null);
  };

  return (
    <>
      <LogoMenu query={query} setQuery={setQuery}>
        <SearchResultCounter movies={movies} />
      </LogoMenu>
      <Main
        movies={movies}
        watched={watched}
        isLoading={isLoading}
        error={error}
        setWatched={setWatched}
        selectedID={selectedID}
        setSelectedId={setSelectedId}
        closeMovieDetail={closeMovieDetail}
      />
    </>
  );
}
