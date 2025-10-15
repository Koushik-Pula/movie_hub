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
    <div className="mh-section">
      <h2 className="mh-section-title">{title}</h2>
      <div className="mh-row-container">
        <button className="mh-row-btn left" onClick={() => scroll("left")}>◀</button>
        <div className="mh-row" ref={rowRef}>
          {movies.map((m) => (
            <div 
              className="mh-card mh-card-small" 
              key={m.id}
              onClick={() => handleMovieClick(m.id)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={m.poster_path ? `https://image.tmdb.org/t/p/w200${m.poster_path}` : "/placeholder.png"}
                alt={m.title}
                className="mh-poster"
              />
              <div className="mh-meta">
                <h3 className="mh-movietitle">{m.title}</h3>
                <p className="mh-rating">⭐ {m.vote_average}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="mh-row-btn right" onClick={() => scroll("right")}>▶</button>
      </div>
    </div>
  );
}