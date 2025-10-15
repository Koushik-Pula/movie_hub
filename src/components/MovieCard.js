import React from "react";
import { useNavigate } from "react-router-dom";

const IMG_BASE = "https://image.tmdb.org/t/p/w500";

export default function MovieCard({ movie }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="mh-card" onClick={handleClick} style={{ cursor: "pointer" }}>
      <img
        className="mh-poster"
        src={movie.poster_path ? IMG_BASE + movie.poster_path : "/placeholder.png"}
        alt={movie.title}
      />
      <div className="mh-meta">
        <h3 className="mh-movietitle">{movie.title}</h3>
        <p className="mh-rating">⭐ {movie.vote_average}</p>
      </div>
    </div>
  );
}