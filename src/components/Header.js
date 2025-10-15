import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header({
  query,
  setQuery,
  searchTerm,
  setSearchTerm,
  includeAdult,
  setIncludeAdult,
  genres,
  selectedGenre,
  handleGenreClick,
  handleHome,
  onSearch,
  searchContainerRef,
  selectedSuggestion,
  setSelectedSuggestion,
  suggestions,
  handleKeyDown
  
}) {
    const navigate = useNavigate();
    
    const handleSearchClick = () => {
        if (!query.trim()) return;
        // Clear suggestions when searching
        setSelectedSuggestion(-1);
        navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    };

    
  return (
    <header className="mh-header">
      <h1 className="mh-logo" onClick={handleHome}>
        🎬 Movie<span>Hub</span>
      </h1>

      <div className="mh-nav-right">
        <div className="mh-search-container" ref={searchContainerRef}>
          <div className="mh-search-row">
            <input
              type="text"
              placeholder="Search your favorite movie..."
              className="mh-search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedSuggestion(-1);
              }}
              onKeyDown={handleKeyDown}
            />
            <button className="mh-search-btn" onClick={handleSearchClick}>🔍</button>
          </div>

          {suggestions.length > 0 && (
            <ul className="mh-suggestions">
              {suggestions.map((s, index) => {
                const regex = new RegExp(`(${query})`, "gi");
                const titleHighlighted = s.title.replace(
                  regex,
                  "<span class='mh-highlight'>$1</span>"
                );

                return (
                  <li
                    key={s.id}
                    className={`mh-suggestion-item ${
                      index === selectedSuggestion ? "active" : ""
                    }`}
                    onClick={() => {
                      setQuery(s.title);
                      setSearchTerm(s.title);
                      setSelectedSuggestion(-1);
                      navigate(`/search?query=${encodeURIComponent(s.title)}`);
                    }}
                  >
                    {s.poster_path && (
                      <img
                        className="mh-suggestion-poster"
                        src={`https://image.tmdb.org/t/p/w92${s.poster_path}`}
                        alt={s.title}
                      />
                    )}
                    <span
                      className="mh-suggestion-title"
                      dangerouslySetInnerHTML={{ __html: titleHighlighted }}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <label className="mh-nsfw">
          <input
            type="checkbox"
            checked={includeAdult}
            onChange={() => setIncludeAdult(!includeAdult)}
          />
          Include NSFW
        </label>

        <div className="mh-categories">
          <button
            className={`mh-cat-btn ${selectedGenre === "" ? "active" : ""}`}
            onClick={() => handleGenreClick("")}
          >
            All
          </button>
          {genres.map((g) => (
            <button
              key={g.id}
              className={`mh-cat-btn ${selectedGenre === g.id ? "active" : ""}`}
              onClick={() => handleGenreClick(g.id)}
            >
              {g.name}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}