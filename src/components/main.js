import { average } from "../config";
import Box from "./box";
import { CustomError } from "./customError";
import { Loader } from "./isLoader";
import { MovieDetails } from "./movies/movieDetails";
import { MovieList } from "./movies/movieList";
import { WatchedList } from "./movies/watchList";
import { MoviesYouWatched } from "./movies/watchedMovies";

export const Main = ({
  movies,
  watched,
  isLoading,
  error,
  setWatched,
  selectedID,
  setSelectedId,
  closeMovieDetail,
}) => {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  const movieIDSelected = (id) => {
    setSelectedId((prevID) => (prevID === id ? null : id));
  };

  const watchedMovies = (addNewWatchedMovies) => {
    setWatched((oldWatchedMovies) => [
      ...oldWatchedMovies,
      addNewWatchedMovies,
    ]);
  };

  const deleteMovieBTN = (movieWatchedID) => {
    const removeMovie = watched.filter(
      (movie) => movie.imdbID !== movieWatchedID
    );
    setWatched(removeMovie);
  };

  return (
    <main className='main'>
      <Box>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <CustomError message={error} />
        ) : (
          <MovieList movies={movies} onSelectedID={movieIDSelected} />
        )}
        {/* {!isLoading && !error && <MovieList movies={movies} />}
        {isLoading && <Loader />}
        {error && <CustomError message={error} />} */}
      </Box>

      <Box>
        {selectedID ? (
          <MovieDetails
            selectedID={selectedID}
            closeMovieDetail={closeMovieDetail}
            onWatchedMovies={watchedMovies}
            watched={watched}
          />
        ) : (
          <>
            <MoviesYouWatched
              watched={watched}
              avgImdbRating={avgImdbRating}
              avgUserRating={avgUserRating}
              avgRuntime={avgRuntime}
            />
            <WatchedList watched={watched} onDeleteMovie={deleteMovieBTN} />
          </>
        )}
      </Box>
    </main>
  );
};
