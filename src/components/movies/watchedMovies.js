export const MoviesYouWatched = ({
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
