import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/MovieDetails.css";

const TMDB_API = process.env.REACT_APP_TMDB_API_KEY;
const IMG_BASE = "https://image.tmdb.org/t/p/w500";
const BACKDROP_BASE = "https://image.tmdb.org/t/p/original";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [includeAdult, setIncludeAdult] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const searchContainerRef = useRef(null);

  const handleHomeClick = () => navigate("/");

  useEffect(() => {
    async function fetchMovieData() {
      setLoading(true);
      try {
        const movieRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API}&language=en-US`
        );
        const movieData = await movieRes.json();
        setMovie(movieData);

        const creditsRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${TMDB_API}`
        );
        const creditsData = await creditsRes.json();
        setCast(creditsData.cast?.slice(0, 10) || []);

        const similarRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${TMDB_API}&language=en-US&page=1`
        );
        const similarData = await similarRes.json();
        setSimilar(similarData.results?.slice(0, 6) || []);

        const videosRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${TMDB_API}&language=en-US`
        );
        const videosData = await videosRes.json();
        setVideos(videosData.results?.filter(v => v.type === "Trailer").slice(0, 3) || []);

      } catch (error) {
        console.error("Error fetching movie data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMovieData();
  }, [id]);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API}&language=en-US&query=${encodeURIComponent(
            query
          )}&page=1&include_adult=${includeAdult}`
        );
        const data = await res.json();
        setSuggestions((data.results || []).slice(0, 5));
      } catch (e) {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, includeAdult]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setSuggestions([]);
        setSelectedSuggestion(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchClick = () => {
    if (!query.trim()) return;
    setSuggestions([]);
    setSelectedSuggestion(-1);
    navigate(`/search?query=${encodeURIComponent(query.trim())}`);
  };

  const handleKeyDown = (e) => {
    if (!suggestions.length && e.key !== "Enter") return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestion((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestion((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedSuggestion >= 0 && suggestions[selectedSuggestion]) {
        const selected = suggestions[selectedSuggestion];
        setSuggestions([]);
        setSelectedSuggestion(-1);
        navigate(`/search?query=${encodeURIComponent(selected.title)}`);
      } else {
        handleSearchClick();
      }
    }
  };

  const getStatusClass = (status) => {
    if (status?.toLowerCase().includes('released')) return 'status-released';
    if (status?.toLowerCase().includes('production')) return 'status-production';
    if (status?.toLowerCase().includes('planned')) return 'status-planned';
    return 'status-other';
  };

  if (loading) {
    return (
      <div className="mh-app">
        <Header
          query={query}
          setQuery={setQuery}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          includeAdult={includeAdult}
          setIncludeAdult={setIncludeAdult}
          searchContainerRef={searchContainerRef}
          suggestions={suggestions}
          selectedSuggestion={selectedSuggestion}
          setSelectedSuggestion={setSelectedSuggestion}
          handleKeyDown={handleKeyDown}
          onSearch={handleSearchClick}
          genres={[]}
          selectedGenre=""
          handleGenreClick={() => {}}
          handleHome={handleHomeClick}
        />
        <div className="md-loading">Loading movie details...</div>
        <Footer />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="mh-app">
        <Header
          query={query}
          setQuery={setQuery}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          includeAdult={includeAdult}
          setIncludeAdult={setIncludeAdult}
          searchContainerRef={searchContainerRef}
          suggestions={suggestions}
          selectedSuggestion={selectedSuggestion}
          setSelectedSuggestion={setSelectedSuggestion}
          handleKeyDown={handleKeyDown}
          onSearch={handleSearchClick}
          genres={[]}
          selectedGenre=""
          handleGenreClick={() => {}}
          handleHome={handleHomeClick}
        />
        <div className="md-error">Movie not found</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="mh-app">
      <Header
        query={query}
        setQuery={setQuery}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        includeAdult={includeAdult}
        setIncludeAdult={setIncludeAdult}
        searchContainerRef={searchContainerRef}
        suggestions={suggestions}
        selectedSuggestion={selectedSuggestion}
        setSelectedSuggestion={setSelectedSuggestion}
        handleKeyDown={handleKeyDown}
        onSearch={handleSearchClick}
        genres={[]}
        selectedGenre=""
        handleGenreClick={() => {}}
        handleHome={handleHomeClick}
      />

      <main className="md-main">
        <div 
          className="md-backdrop"
          style={{
            backgroundImage: movie.backdrop_path 
              ? `url(${BACKDROP_BASE}${movie.backdrop_path})`
              : 'none'
          }}
        >
          <div className="md-backdrop-overlay"></div>
        </div>

        <div className="md-content">
          <div className="md-hero">
            <div className="md-poster-container">
              <img
                className="md-poster"
                src={movie.poster_path ? IMG_BASE + movie.poster_path : "/placeholder.png"}
                alt={movie.title}
              />
            </div>

            <div className="md-info">
              <h1 className="md-title">{movie.title}</h1>
              
              {movie.tagline && (
                <p className="md-tagline">"{movie.tagline}"</p>
              )}

              <div className="md-meta">
                <span className="md-rating">⭐ {movie.vote_average.toFixed(1)}</span>
                <span className="md-year">{movie.release_date?.split('-')[0]}</span>
                <span className="md-runtime">{movie.runtime} min</span>
              </div>

              <div className="md-genres">
                {movie.genres?.map(g => (
                  <span key={g.id} className="md-genre-tag">{g.name}</span>
                ))}
              </div>

              <div className="md-overview">
                <h2>Overview</h2>
                <p>{movie.overview}</p>
              </div>

              <div className="md-details">
                <div className="md-detail-item">
                  <strong>Status</strong>
                  <span className={`md-detail-value ${getStatusClass(movie.status)}`}>
                    {movie.status}
                  </span>
                </div>
                <div className="md-detail-item">
                  <strong>Budget</strong>
                  <span className="md-detail-value">
                    {movie.budget ? `$${movie.budget.toLocaleString()}` : 'N/A'}
                  </span>
                </div>
                <div className="md-detail-item">
                  <strong>Revenue</strong>
                  <span className="md-detail-value">
                    {movie.revenue ? `$${movie.revenue.toLocaleString()}` : 'N/A'}
                  </span>
                </div>
                {movie.production_companies?.length > 0 && (
                  <div className="md-detail-item">
                    <strong>Production</strong>
                    <span className="md-detail-value">
                      {movie.production_companies.map(c => c.name).join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {cast.length > 0 && (
            <section className="md-section">
              <h2 className="md-section-title">Cast</h2>
              <div className="md-cast-grid">
                {cast.map(person => (
                  <div key={person.id} className="md-cast-card">
                    <img
                      className="md-cast-photo"
                      src={person.profile_path 
                        ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                        : "/placeholder.png"
                      }
                      alt={person.name}
                    />
                    <div className="md-cast-info">
                      <p className="md-cast-name">{person.name}</p>
                      <p className="md-cast-character">{person.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {videos.length > 0 && (
            <section className="md-section">
              <h2 className="md-section-title">Trailers</h2>
              <div className="md-videos-grid">
                {videos.map(video => (
                  <div key={video.id} className="md-video-card">
                    <iframe
                      className="md-video-iframe"
                      src={`https://www.youtube.com/embed/${video.key}`}
                      title={video.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                    <p className="md-video-title">{video.name}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {similar.length > 0 && (
            <section className="md-section">
              <h2 className="md-section-title">Similar Movies</h2>
              <div className="md-similar-grid">
                {similar.map(m => (
                  <div 
                    key={m.id} 
                    className="md-similar-card"
                    onClick={() => navigate(`/movie/${m.id}`)}
                  >
                    <img
                      className="md-similar-poster"
                      src={m.poster_path ? IMG_BASE + m.poster_path : "/placeholder.png"}
                      alt={m.title}
                    />
                    <div className="md-similar-info">
                      <h3 className="md-similar-title">{m.title}</h3>
                      <p className="md-similar-rating">⭐ {m.vote_average.toFixed(1)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}