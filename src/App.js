import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import SearchResults from "./pages/SearchResults";
import MovieDetails from './components/MovieDetails';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>
    </Router>
  );
}
