import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function HorizontalSlider({ title, movies }) {
  const rowRef = useRef();
  const navigate = useNavigate();

  const scroll = (direction) => {
    if (!rowRef.current) return;
    const width = rowRef.current.clientWidth;
    rowRef.current.scrollBy({
      left: direction === "left" ? -width : width,
      behavior: "smooth",
    });
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className="mh-slider-section">
      <h2 className="mh-slider-title">{title}</h2>
      <div className="mh-row-container">
        <button className="mh-row-btn left" onClick={() => scroll("left")}>◀</button>
        <div className="mh-row" ref={rowRef}>
          {movies.map((m) => (
            <div 
              className="mh-slider-card" 
              key={m.id}
              onClick={() => handleMovieClick(m.id)}
            >
              <img
                src={m.poster_path ? `https://image.tmdb.org/t/p/w200${m.poster_path}` : "/placeholder.png"}
                alt={m.title}
                className="mh-slider-poster"
              />
              <div className="mh-slider-meta">
                <h3 className="mh-slider-title-text">{m.title}</h3>
                <p className="mh-slider-rating">⭐ {m.vote_average.toFixed(1)}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="mh-row-btn right" onClick={() => scroll("right")}>▶</button>
      </div>
    </div>
  );
}