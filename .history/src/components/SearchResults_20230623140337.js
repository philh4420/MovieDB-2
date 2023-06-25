import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SearchResults.css';
import { Link } from 'wouter';

const SearchResults = ({ params }) => {
  const apiKey = process.env.REACT_APP_API_KEY;
  const query = decodeURIComponent(params.query);

  const [movieResults, setMovieResults] = useState([]);
  const [tvShowResults, setTVShowResults] = useState([]);
  const [currentMoviePage, setCurrentMoviePage] = useState(1);
  const [totalMoviePages, setTotalMoviePages] = useState(1);
  const [currentTVShowPage, setCurrentTVShowPage] = useState(1);
  const [totalTVShowPages, setTotalTVShowPages] = useState(1);

  const fetchMovieResults = async (query, page) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${query}&page=${page}`
      );
      const sortedMovies = response.data.results.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
      setMovieResults(sortedMovies); // Update movie results
      setTotalMoviePages(response.data.total_pages); // Update total movie pages
    } catch (error) {
      console.log('Error fetching movie results:', error);
    }
  };

  const fetchTVShowResults = async (query, page) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&language=en-US&query=${query}&page=${page}`
      );
      const sortedTVShows = response.data.results.sort((a, b) => new Date(a.first_air_date) - new Date(b.first_air_date));
      setTVShowResults(sortedTVShows); // Update TV show results
      setTotalTVShowPages(response.data.total_pages); // Update total TV show pages
    } catch (error) {
      console.log('Error fetching TV show results:', error);
    }
  };

  useEffect(() => {
    if (query) {
      fetchMovieResults(query, currentMoviePage);
      fetchTVShowResults(query, currentTVShowPage);
    }
  }, [query, currentMoviePage, currentTVShowPage]);

  const handleMoviePageChange = (pageNumber) => {
    setCurrentMoviePage(pageNumber);
  };

  const handleTVShowPageChange = (pageNumber) => {
    setCurrentTVShowPage(pageNumber);
  };

  const formatDateUK = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  return (
    <div className="search-results">
      <h1 className="search-results-title">Movie Results for "{query}"</h1>
      <ul className="movie-results-list">
        {movieResults.map((result) => (
          <li key={result.id} className="movie-result-item">
            <img src={`https://image.tmdb.org/t/p/w500/${result.poster_path}`} alt={result.title} className="home__image" />
            <div className="movie-result-details">
              <h2 className="home__title">{result.title}</h2>
              <p className="home__release-date">Release Date: {formatDateUK(result.release_date)}</p>
              <p className="home__rating">Rating: {result.vote_average}</p>
              <p className="home__overview">{result.overview}</p>
              <Link href={`/movies/${result.id}`}>
                <button className="search__details-button">View Details</button>
              </Link>
            </div>
          </li>
        ))}
      </ul>
      <div className="home__pagination">
        {currentMoviePage > 1 && (
          <button
            className="home__pagination-button home__pagination-previous"
            onClick={() => handleMoviePageChange(currentMoviePage - 1)}
          >
            &#8249;
          </button>
        )}
        <span className="home__pagination-page">
          Page {currentMoviePage} of {totalMoviePages}
        </span>
        {currentMoviePage < totalMoviePages && (
          <button
            className="home__pagination-button home__pagination-next"
            onClick={() => handleMoviePageChange(currentMoviePage + 1)}
          >
            &#8250;
          </button>
        )}
      </div>

      <h1 className="search-results-title">TV Show Results for "{query}"</h1>
      <ul className="tv-show-results-list">
        {tvShowResults.map((result) => (
          <li key={result.id} className="tv-show-result-item">
            <img src={`https://image.tmdb.org/t/p/w500/${result.poster_path}`} alt={result.name} className="home__image" />
            <div className="tv-show-result-details">
              <h2 className="home__title">{result.name}</h2>
              <p className="home__air-date">First Air Date: {formatDateUK(result.first_air_date)}</p>
              <p className="home__rating">Rating: {result.vote_average}</p>
              <p className="home__overview">{result.overview}</p>
              <Link href={`/tvshows/${result.id}`}>
                <button className="search__details-button">View Details</button>
              </Link>
            </div>
          </li>
        ))}
      </ul>
      <div className="home__pagination">
        {currentTVShowPage > 1 && (
          <button
            className="home__pagination-button home__pagination-previous"
            onClick={() => handleTVShowPageChange(currentTVShowPage - 1)}
          >
            &#8249;
          </button>
        )}
        <span className="home__pagination-page">
          Page {currentTVShowPage} of {totalTVShowPages}
        </span>
        {currentTVShowPage < totalTVShowPages && (
          <button
            className="home__pagination-button home__pagination-next"
            onClick={() => handleTVShowPageChange(currentTVShowPage + 1)}
          >
            &#8250;
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
