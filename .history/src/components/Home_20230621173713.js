// Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './Home.css';
import { Link } from 'wouter';
import { format } from 'date-fns';
import { formatDateUK } from './utils';

const apiKey = process.env.REACT_APP_API_KEY;

const Home = () => {
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [currentMoviePage, setCurrentMoviePage] = useState(1);
  const [totalMoviePages, setTotalMoviePages] = useState(1);

  const fetchData = async (url, page, setData, setTotalPages) => {
    try {
      const currentDate = format(new Date(), 'yyyy-MM');
      const response = await axios.get(
        `${url}?api_key=${apiKey}&language=en-US&primary_release_date.gte=${currentDate}&page=${page}`
      );
      const sortedData = response.data.results.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
      setData(sortedData);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
    }
  };

  useEffect(() => {
    fetchData('https://api.themoviedb.org/3/movie/upcoming', currentMoviePage, setUpcomingMovies, setTotalMoviePages);
  }, [currentMoviePage]);

  const handleMoviePageChange = (pageNumber) => {
    setCurrentMoviePage(pageNumber);
  };

  return (
    <div className="home">
      <h1 className="title">Upcoming Movies</h1>
      <ul className="home__list">
        {upcomingMovies.map((movie) => (
          <li key={movie.id} className="home__item">
            <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} className="home__image" />
            <div className="home__details">
              <h2 className="home__title">{movie.title}</h2>
              <p className="home__release-date">Release Date: {formatDateUK(movie.release_date)}</p>
              <p className="home__rating">Rating: {movie.vote_average}</p>
              <p className="home__overview">{movie.overview}</p>
              <Link to={`/movies/${movie.id}`}>
                <button className="home__details-button">View Details</button>
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
    </div>
  );
};

Home.propTypes = {};

export default Home;
