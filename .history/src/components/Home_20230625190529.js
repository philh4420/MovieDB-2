import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './Home.css';
import { Link } from 'wouter';
import { format } from 'date-fns';
import { formatDateUK } from './utils';
import Pagination from './Pagination';

const apiKey = process.env.REACT_APP_API_KEY;

const fetchData = async (url, page) => {
  const currentDate = format(new Date(), 'yyyy-MM');
  const response = await axios.get(
    `${url}?api_key=${apiKey}&language=en-US&primary_release_date.gte=${currentDate}&page=${page}`
  );
  const sortedData = response.data.results.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
  return { data: sortedData, totalPages: response.data.total_pages };
};

const Home = () => {
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [currentMoviePage, setCurrentMoviePage] = useState(1);
  const [totalMoviePages, setTotalMoviePages] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData('https://api.themoviedb.org/3/movie/upcoming', currentMoviePage)
      .then(({ data, totalPages }) => {
        setUpcomingMovies(data);
        setTotalMoviePages(totalPages);
      })
      .catch((error) => {
        console.error(`Error fetching data from API:`, error);
        setError('Error fetching data. Please try again later.');
      });
  }, [currentMoviePage]);

  if (error) {
    return <div>{error}</div>;
  }

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
      <Pagination
        currentPage={currentMoviePage}
        totalPages={totalMoviePages}
        onPageChange={setCurrentMoviePage}
      />
    </div>
  );
};

Home.propTypes = {};

export default Home;
