import { useEffect, useState } from "react";
import StarRating from "./startRating";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "36937569";
export default function App() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedID, setSelectedId] = useState(null);
  const [watched, setWatched] = useState(() => {
    const stored = localStorage.getItem("watched");
    return JSON.parse(stored);
  });

  const closeMovieDetail = () => {
    setSelectedId(null);
  };

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
    closeMovieDetail();
    fetchData();

    return () => {
      controler.abort();
    };
  }, [query]);

  useEffect(() => {
    localStorage.setItem("watched", JSON.stringify(watched));
  }, [watched]);

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

const Loader = () => <div className='loader'>Loading...</div>;

const CustomError = ({ message }) => (
  <div className='error'>
    <span>⛔</span>
    {message}
  </div>
);

const LogoMenu = ({ query, setQuery, children }) => {
  return (
    <nav className='nav-bar'>
      <Logo />
      <Search query={query} setQuery={setQuery} />
      {children}
    </nav>
  );
};

const Logo = () => {
  return (
    <div className='logo'>
      <span role='img'>🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
};

const Search = ({ query, setQuery }) => {
  return (
    <input
      className='search'
      type='text'
      placeholder='Search movies...'
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
};

const SearchResultCounter = ({ movies }) => {
  return (
    <p className='num-results'>
      Found <strong>{movies.length}</strong> results
    </p>
  );
};

const Main = ({
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
  // const [selectedID, setSelectedId] = useState(null);

  const movieIDSelected = (id) => {
    setSelectedId((prevID) => (prevID === id ? null : id));
  };

  // const closeMovieDetail = () => {
  //   setSelectedId(null);
  // };

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

const Box = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className='box'>
      <button className='btn-toggle' onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
};

const MovieDetails = ({
  selectedID,
  closeMovieDetail,
  onWatchedMovies,
  watched,
}) => {
  const [movie, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userRating, setUserRating] = useState(0);

  const isAlreadyRated = watched
    .map((movie) => movie.imdbID)
    .includes(selectedID);

  const ratedStar = watched.filter(
    (movie) => movie.imdbID.trim() === selectedID.trim()
  );

  const UserRating = ratedStar.length > 0 ? ratedStar[0].userRating : null;

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
    Country: country,
    Rated: rated,
  } = movie;

  const addNewMoviesToList = (alreadyPresent) => {
    const watcheMovieObj = {
      imdbID: selectedID,
      title,
      year,
      poster,
      imdbRating,
      userRating: Number(userRating),
      runtime: Number(runtime.split(" ")[0]),
    };

    const isAlreadyPresent = alreadyPresent.some(
      (movie) => movie.imdbID === watcheMovieObj.imdbID
    );

    if (!isAlreadyPresent) onWatchedMovies(watcheMovieObj);

    closeMovieDetail();
  };

  useEffect(() => {
    const fetchMovieByID = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedID}`
        );

        const data = await res.json();
        setMovies(data);
        setIsLoading(false);
      } catch (error) {}
    };
    fetchMovieByID();
  }, [selectedID]);

  useEffect(() => {
    if (!title) return;
    const titles = `Movie: ${title}`;
    document.title = titles;

    return () => {
      document.title = "UsePopcorn";
    };
  }, [title]);

  useEffect(() => {
    const callBackFnc = (e) => {
      if (e.code === "Escape") {
        closeMovieDetail();
        console.log("Closed");
      }
    };

    document.addEventListener("keydown", callBackFnc);

    return () => {
      document.removeEventListener("keydown", callBackFnc);
    };
  });

  return isLoading ? (
    <Loader />
  ) : (
    <div className='details'>
      <header>
        <button className='btn-back' onClick={closeMovieDetail}>
          &larr;
        </button>
        <img src={poster} alt={`poster of ${title}`} />
        <div className='details-overview'>
          <h2>{title}</h2>
          <p>
            {released} &bull; {runtime}
          </p>
          <p>{genre}</p>
          <p>
            <span>⭐</span>
            {imdbRating} IMDB rating
          </p>
        </div>
      </header>
      <section>
        <div className='rating'>
          {!isAlreadyRated ? (
            <>
              <StarRating
                maxRating={10}
                size={24}
                onSetRating={setUserRating}
              />
              {userRating > 0 && (
                <button
                  onClick={() => addNewMoviesToList(watched)}
                  className='btn-add'
                >
                  + Add to list
                </button>
              )}
            </>
          ) : (
            <div>
              You Already Rated this Movie {UserRating}
              <span>⭐</span>
            </div>
          )}
        </div>
        <p>
          <em>{plot}</em>
        </p>
        <p>Country: {country}</p>
        <p>Starring: {actors}</p>
        {director !== "N/A" ? <p>Directed by {director}</p> : ""}
      </section>
    </div>
  );
};

const MovieList = ({ movies, onSelectedID }) => {
  return (
    <ul className='list list-movies'>
      {movies?.map((movie) => (
        <li key={movie.imdbID} onClick={() => onSelectedID(movie.imdbID)}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>🗓</span>
              <span>{movie.Year}</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};

const MoviesYouWatched = ({
  watched,
  avgImdbRating,
  avgUserRating,
  avgRuntime,
}) => {
  return (
    <div className='summary'>
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{Math.round(avgImdbRating * 100) / 100}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{Math.round(avgUserRating * 100) / 100}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{Math.round(avgRuntime * 100) / 100} min</span>
        </p>
      </div>
    </div>
  );
};

const WatchedList = ({ watched, onDeleteMovie }) => {
  return (
    <ul className='list'>
      {watched.map((movie) => (
        <li key={movie.imdbID}>
          <img src={movie.poster} alt={`${movie.title} poster`} />
          <h3>{movie.title}</h3>
          <div>
            <p>
              <span>⭐️</span>
              <span>{movie.imdbRating}</span>
            </p>
            <p>
              <span>🌟</span>
              <span>{movie.userRating}</span>
            </p>
            <p>
              <span>⏳</span>
              <span>{movie.runtime} min</span>
            </p>
            <button
              className='btn-delete'
              onClick={() => onDeleteMovie(movie.imdbID)}
            >
              ❌
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};
