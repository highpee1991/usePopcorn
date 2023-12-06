import { useEffect, useRef, useState } from "react";
import config from "../../config";
import { useKey } from "../../customHooks/useKey";
import { Loader } from "../isLoader";
import StarRating from "../../startRating";

const KEY = config.KEY;
export const MovieDetails = ({
  selectedID,
  closeMovieDetail,
  onWatchedMovies,
  watched,
}) => {
  const [movie, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const countRef = useRef(0);

  useEffect(() => {
    if (userRating) countRef.current++;
  }, [userRating]);

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
  } = movie;

  const addNewMoviesToList = (alreadyPresent) => {
    const watcheMovieObj = {
      imdbID: selectedID,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ")[0]),
      userRating,
      counterStar: countRef.current,
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

  useKey(closeMovieDetail, "Escape");

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
