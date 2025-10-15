import React, { useState, useEffect, useRef } from "react";
import MovieGrid from "./components/MovieGrid";
import HorizontalSlider from "./components/HorizantalSlider";
import Header from "./components/Header";
import Footer from "./components/Footer";

import "./styles/HorizantalSlider.css";
import "./styles/main.css";

import { useNavigate } from "react-router-dom";

const TMDB_API = process.env.REACT_APP_TMDB_API_KEY;

export default function App() {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [includeAdult, setIncludeAdult] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [popularMovies, setPopularMovies] = useState([]);
  const [newReleaseMovies, setNewReleaseMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [genreMovies, setGenreMovies] = useState({});


  const searchContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchGenreMovies() {
      const dataObj = {};
      for (const g of genres) {
        const res = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API}&with_genres=${g.id}&language=en-US`
        );
        const data = await res.json();
        dataObj[g.id] = data.results || [];
      }
      setGenreMovies(dataObj);
    }
    if (genres.length) fetchGenreMovies();
  }, [genres]);
  

  useEffect(() => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [suggestions]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const popularRes = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API}`);
        setPopularMovies((await popularRes.json()).results || []);
  
        const nowPlayingRes = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API}`);
        setNewReleaseMovies((await nowPlayingRes.json()).results || []);
  
        const upcomingRes = await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_API}`);
        setUpcomingMovies((await upcomingRes.json()).results || []);
      } catch (err) {
        console.error(err);
      }
    }
  
    fetchCategories();
  }, []);
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setSuggestions([]); // close dropdown
        setSelectedSuggestion(-1);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    async function fetchGenres() {
      const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API}&language=en-US`);
      const data = await res.json();
      setGenres(data.genres || []);
    }
    fetchGenres();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
  
    const timer = setTimeout(async () => { 
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=${includeAdult}`
        );
        const data = await res.json();
        setSuggestions((data.results || []).slice(0, 5)); 
      } catch (e) {
        setSuggestions([]);
      }
    }, 300); 
  
    return () => clearTimeout(timer);
  }, [query, includeAdult]);

  
  

  const handleSearchClick = () => {
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query)}&adult=${includeAdult}`);
    }
  };

  const handleGenreClick = (id) => {
    setSelectedGenre(id);
    setSearchTerm("");
    setQuery("");
    setPage(1);
  
    if (id) {
      const section = document.getElementById(`genre-${id}`);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      // scroll to top if "All" is clicked
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  

  const handleKeyDown = (e) => {
    if (!suggestions.length) return;
  
    if (e.key === "ArrowDown") {
      setSelectedSuggestion((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      setSelectedSuggestion((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter") {
      if (selectedSuggestion >= 0) {
        const selected = suggestions[selectedSuggestion];
        setQuery(selected.title);
        setSearchTerm(selected.title);
        setSuggestions([]);
        setSelectedSuggestion(-1);
      } else {
        handleSearchClick();
      }
    }
  };
  

  const handleHome = () => {
    setSelectedGenre("");
    setSearchTerm("");
    setQuery("");
    setPage(1);
  };

  const nextPage = () => setPage((p) => p + 1);
  const prevPage = () => setPage((p) => (p > 1 ? p - 1 : 1));

  return (
    <div className="mh-app">
      <Header
      query={query}
  setQuery={setQuery}
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  includeAdult={includeAdult}
  setIncludeAdult={setIncludeAdult}
  genres={genres}
  selectedGenre={selectedGenre}
  handleGenreClick={handleGenreClick}
  handleHome={handleHome}
  onSearch={handleSearchClick}
  searchContainerRef={searchContainerRef}
  selectedSuggestion={selectedSuggestion}
  setSelectedSuggestion={setSelectedSuggestion}
  suggestions={suggestions}
      handleKeyDown={handleKeyDown}
      />
      



<main className="mh-main">
  {genres.map((g) => (
    <section id={`genre-${g.id}`} key={g.id} className="mh-section">
      <h2 className="mh-section-title">{g.name}</h2>
      <HorizontalSlider title={g.name} movies={genreMovies[g.id] || []} />
    </section>
  ))}
</main>



<Footer />
    </div>
  );
}
