import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TMDB_API = process.env.REACT_APP_TMDB_API_KEY;
const IMG_BASE = "https://image.tmdb.org/t/p/w342";

export default function MovieGrid({ movies, query, page, genre, includeAdult }) {
  const [internalMovies, setInternalMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fadeKey, setFadeKey] = useState(0);
  const navigate = useNavigate();

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  // If movies are passed directly (from SearchResults), use them
  useEffect(() => {
    if (movies && movies.length > 0) {
      setInternalMovies(movies);
      setFadeKey((prev) => prev + 1);
      return;
    }
  }, [movies]);

  // Otherwise fetch movies based on query/genre/page (for HomePage)
  useEffect(() => {
    // Don't fetch if movies are already provided
    if (movies && movies.length > 0) return;
    
    // Don't fetch if we don't have the required props
    if (page === undefined || includeAdult === undefined) return;

    async function fetchMovies() {
      setLoading(true);
      let url = "";

      if (query) {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API}&language=en-US&query=${encodeURIComponent(query)}&page=${page}&include_adult=${includeAdult}`;
      } else if (genre) {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API}&language=en-US&with_genres=${genre}&page=${page}&include_adult=${includeAdult}`;
      } else {
        url = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API}&language=en-US&page=${page}&include_adult=${includeAdult}`;
      }

      try {
        const res = await fetch(url);
        const data = await res.json();
        setInternalMovies(data.results || []);
        setFadeKey((prev) => prev + 1);
      } catch (e) {
        setInternalMovies([]);
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, [query, page, genre, includeAdult, movies]);

  if (loading) return <div className="mh-loading">Loading...</div>;
  if (!internalMovies.length) return <div className="mh-empty">No movies found</div>;

  return (
    <div key={fadeKey} className="mh-grid">
      {internalMovies.map((m, index) => (
        <article 
          className="mh-card" 
          key={m.id}
          onClick={() => handleMovieClick(m.id)}
          style={{ cursor: "pointer" }}
        >
          <div
            className="mh-card-inner stagger"
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <img
              className="mh-poster"
              src={m.poster_path ? IMG_BASE + m.poster_path : "/placeholder.png"}
              alt={m.title}
            />
            <div className="mh-meta">
              <h3 className="mh-movietitle">{m.title}</h3>
              <p className="mh-rating">⭐ {m.vote_average}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}