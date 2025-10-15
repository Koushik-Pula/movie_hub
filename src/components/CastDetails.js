import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "../styles/CastDetails.css";

const TMDB_API = process.env.REACT_APP_TMDB_API_KEY;
const IMG_BASE = "https://image.tmdb.org/t/p/w500";

export default function CastDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [person, setPerson] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [includeAdult, setIncludeAdult] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const searchContainerRef = useRef(null);

  const handleHomeClick = () => navigate("/");

  useEffect(() => {
    async function fetchCastData() {
      setLoading(true);
      try {
        const personRes = await fetch(
          `https://api.themoviedb.org/3/person/${id}?api_key=${TMDB_API}&language=en-US`
        );
        const personData = await personRes.json();
        setPerson(personData);

        const moviesRes = await fetch(
          `https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${TMDB_API}&language=en-US`
        );
        const moviesData = await moviesRes.json();
        
        const popularMovies = moviesData.cast
          ?.sort((a, b) => b.popularity - a.popularity)
          .slice(0, 8) || [];
        setMovies(popularMovies);

      } catch (error) {
        console.error("Error fetching cast data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCastData();
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

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
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
        <div className="cd-loading">Loading cast details...</div>
        <Footer />
      </div>
    );
  }

  if (!person) {
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
        <div className="cd-error">Cast member not found</div>
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

      <main className="cd-main">
        <div className="cd-container">
          <div className="cd-hero">
            <div className="cd-photo-section">
              <img
                className="cd-photo"
                src={person.profile_path ? IMG_BASE + person.profile_path : "/placeholder.png"}
                alt={person.name}
              />
            </div>
            
            <div className="cd-info">
              <h1 className="cd-name">{person.name}</h1>
              
              {person.known_for_department && (
                <div className="cd-department">
                  <strong>Department:</strong> {person.known_for_department}
                </div>
              )}
              
              {person.birthday && (
                <div className="cd-birthday">
                  <strong>Born:</strong> {person.birthday}
                  {person.place_of_birth && ` in ${person.place_of_birth}`}
                </div>
              )}
              
              {person.deathday && (
                <div className="cd-deathday">
                  <strong>Died:</strong> {person.deathday}
                </div>
              )}

              {person.biography && (
                <div className="cd-biography">
                  <h2>Biography</h2>
                  <p>{person.biography}</p>
                </div>
              )}
            </div>
          </div>

          {movies.length > 0 && (
            <section className="cd-movies-section">
              <h2 className="cd-section-title">Popular Movies</h2>
              <div className="cd-movies-grid">
                {movies.map(movie => (
                  <div 
                    key={movie.id} 
                    className="cd-movie-card"
                    onClick={() => handleMovieClick(movie.id)}
                  >
                    <img
                      className="cd-movie-poster"
                      src={movie.poster_path ? IMG_BASE + movie.poster_path : "/placeholder.png"}
                      alt={movie.title}
                    />
                    <div className="cd-movie-info">
                      <h3 className="cd-movie-title">{movie.title}</h3>
                      <p className="cd-movie-character">{movie.character}</p>
                      <p className="cd-movie-rating">⭐ {movie.vote_average.toFixed(1)}</p>
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