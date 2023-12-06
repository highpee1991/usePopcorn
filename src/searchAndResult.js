import { useRef } from "react";
import { useKey } from "./customHooks/useKey";

export const Search = ({ query, setQuery }) => {
  const inputEl = useRef(null);

  useKey(() => {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery("");
  }, "Enter");

  return (
    <input
      className='search'
      type='text'
      placeholder='Search movies...'
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
};

export const SearchResultCounter = ({ movies }) => {
  return (
    <p className='num-results'>
      Found <strong>{movies.length}</strong> results
    </p>
  );
};
