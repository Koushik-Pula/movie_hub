import React, { useEffect, useState } from "react";
import MovieCard from "./MovieCard";

const TMDB_API = process.env.REACT_APP_TMDB_API_KEY;
const IMG_BASE = "https://image.tmdb.org/t/p/w500";

export default function MovieSlider({ category, includeAdult }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function fetchMovies() {
      const url = `https://api.themoviedb.org/3/movie/${category}?api_key=${TMDB_API}&language=en-US&page=1&include_adult=${includeAdult}`;
      const res = await fetch(url);
      const data = await res.json();
      setMovies(data.results || []);
    }
    fetchMovies();
  }, [category, includeAdult]);

  return (
    <div className="mh-slider">
      <div className="mh-slider-track">
        {movies.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
    </div>
  );
}
