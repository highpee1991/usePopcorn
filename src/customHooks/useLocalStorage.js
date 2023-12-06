import { useEffect, useState } from "react";

const useLocalStorage = (initial, key) => {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initial;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return { watched: value, setWatched: setValue };
};

export default useLocalStorage;
