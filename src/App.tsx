import { useDebounce } from "react-use";
import Loading from "./components/Loading";
import MovieCard from "./components/MovieCard";
import Search from "./components/Search";
import { useEffect, useState } from "react";
import { getTrendingMovies, updateSearchCount } from "./appwrite";
import { Models } from "appwrite";

interface Movie {
  $id: string | null | undefined;
  poster_url: string | undefined;
  poster_path: string;
  release_date: string;
  vote_average: number;
  title: string;
  original_language: string;
}

// const API_BASE_URL = "https://api.themoviedb.org/3/configuration"
const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json", // API will send back a JSON object
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 1000, [searchTerm]);

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        setErrorMessage(data.Error || "No movies found");
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);
      if (query && data.results.length > 0) {
        try {
          await updateSearchCount(query, data.results[0]);
        } catch (error) {
          console.error("Error updating search count:", error);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message || "Error fetching movies");
      } else {
        setErrorMessage("Error fetching movies");
      }
      return;
    } finally {
      setIsLoading(false);
      setErrorMessage("");
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies: Models.Document[] = await getTrendingMovies();
      
      const formattedMovies: Movie[] = movies.map((movie: Models.Document) => ({
        $id: movie.$id,
        poster_url: movie.poster_url,
        poster_path: movie.poster_path || "",
        release_date: movie.release_date || "",
        vote_average: movie.vote_average || 0,
        title: movie.title || "Untitled",
        original_language: movie.original_language || "Unknown",
      }));
  
      setTrendingMovies(formattedMovies);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="./hero.png" alt="Hero Banner" />
            <h1>
              Find <span className="text-gradient">Movies</span> You&apos;ll
              Enjoy Without the Hassle
            </h1>
            <Search
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            ></Search>
          </header>

          {trendingMovies.length > 0 && (
            <section className="trending">
              <h2>Trending</h2>
              <ul>
                {trendingMovies.map((movie: Movie, index) => (
                  <li key={movie.$id}>
                    <p>{index + 1}</p>
                    <img src={movie.poster_url} alt={movie.title} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="all-movies">
            <h2>All Movies</h2>
            {isLoading ? (
              <Loading></Loading>
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie: Movie) => (
                  <MovieCard
                    key={movie.$id || movie.title}
                    title={movie.title}
                    original_language={movie.original_language}
                    poster_path={movie.poster_path}
                    release_date={movie.release_date}
                    vote_average={movie.vote_average}
                  ></MovieCard>
                ))}
              </ul>
            )}
            {errorMessage ? <p>Error fetching movies</p> : ""}
          </section>
        </div>
        <p className="text-white">{searchTerm}</p>
      </div>
    </main>
  );
};

export default App;
