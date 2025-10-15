import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MovieGrid from "../components/MovieGrid";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const TMDB_API = process.env.REACT_APP_TMDB_API_KEY;

export default function SearchResults() {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [includeAdult, setIncludeAdult] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [movies, setMovies] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);
  
  const handleHomeClick = () => navigate("/");

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setSuggestions([]);
        setSelectedSuggestion(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    const params = new URLSearchParams(location.search);
    const term = params.get("query") || "";
    
    console.log("Search term from URL:", term);
    
    if (!term) {
      setMovies([]);
      setQuery("");
      setSearchTerm("");
      setSuggestions([]);
      return;
    }
  
    setQuery(term);
    setSearchTerm(term);
    setSuggestions([]); 
  
    async function fetchMovies() {
      try {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API}&language=en-US&query=${encodeURIComponent(term)}&page=1&include_adult=${includeAdult}`;
        console.log("Fetching from:", url);
        
        const res = await fetch(url);
        const data = await res.json();
        
        console.log("API Response:", data);
        console.log("Movies found:", data.results?.length || 0);
        
        setMovies(data.results || []);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setMovies([]);
      }
    }
  
    fetchMovies();
  }, [location.search, includeAdult]);

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
        setQuery(selected.title);
        setSuggestions([]);
        setSelectedSuggestion(-1);
        navigate(`/search?query=${encodeURIComponent(selected.title)}`);
      } else {
        handleSearchClick();
      }
    }
  };

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

      <main className="mh-main">
        {(() => {
          console.log("Rendering with movies:", movies);
          console.log("Movies length:", movies?.length);
          console.log("SearchTerm:", searchTerm);
          
          if (searchTerm && movies.length === 0) {
            return <p className="mh-empty">No movies found for "{searchTerm}".</p>;
          } else if (movies.length > 0) {
            return <MovieGrid movies={movies} />;
          } else {
            return <p className="mh-empty">Search for a movie to see results.</p>;
          }
        })()}
      </main>

      <Footer />
    </div>
  );
}