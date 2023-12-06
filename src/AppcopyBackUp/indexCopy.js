import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import StarRating from "../startRating";
// import "./index.css";
// import App from "./App";

const Rating = () => {
  const [movieRating, setMovieRating] = useState(0);

  return (
    <>
      <StarRating onSetRating={setMovieRating} defaultRating={3} />
      <p>This movie is rated {movieRating} Number</p>
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {
      /* <App /> */
      <>
        <StarRating maxRating={5} color='blue' defaultRating={2} />
        <StarRating maxRating={10} size={30} color='gold' />
        <StarRating
          size={25}
          color='red'
          message={["terrible", "bad", "Okey", "Good", "Amazing"]}
        />
        <Rating />
      </>
    }
  </React.StrictMode>
);
