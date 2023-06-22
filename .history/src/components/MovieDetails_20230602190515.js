import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'wouter';

import './MovieDetails.css';

const apiKey = 'e7811799fcbd2c5fe1c7eed7a7955b7d';

const formatDateUK = (dateString) => {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString('en-GB', options);

  const day = date.getDate().toString().padStart(2, '0');
  // eslint-disable-next-line
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day} ${formattedDate.split(' ')[1]} ${year}`;
};

const MovieDetails = (props) => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${props.params.id}?api_key=${apiKey}&language=en-US`
        );
        setMovieDetails(movieResponse.data);

        const creditsResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${props.params.id}/credits?api_key=${apiKey}`
        );
        setCast(creditsResponse.data.cast);

        const videosResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${props.params.id}/videos?api_key=${apiKey}&language=en-US`
        );
        const trailers = videosResponse.data.results.filter((video) =>
          video.type.toLowerCase().includes('trailer')
        );
        if (trailers.length > 0) {
          setTrailerUrl(trailers[0].key);
        }
      } catch (error) {
        console.log('Error fetching movie details:', error);
      }
    };

    fetchMovieDetails();
  }, [props.params.id]);

  const openModal = () => {
    if (trailerUrl) {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTrailerUrl(null);
  };

  if (!movieDetails) {
    return <div className='cast-details__loading'>Loading...</div>;
  }

  const { title, overview, release_date, runtime, vote_average, genres, poster_path } = movieDetails;

  return (
    <div className="movie-details">
      <div className="modal" style={{ display: isModalOpen ? 'block' : 'none' }}>
        <div className="modal__content">
          <span className="modal__close" onClick={closeModal}>&times;</span>
          <iframe
            title="Movie Trailer"
            className="modal__video"
            src={`https://www.youtube.com/embed/${trailerUrl}`}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      </div>
      <div className="movie-details__container">
        <img className="movie-details__poster" src={`https://image.tmdb.org/t/p/w500/${poster_path}`} alt={title} />

        <div className="movie-details__info">
          <button className="trailer-button" onClick={openModal}>
            Watch Trailer
          </button>
          <div>
            <h1 className="movie-details__title">{title}</h1>
            <p className="movie-details__overview">Overview: {overview}</p>
            <p className="movie-details__release-date">Release Date: {formatDateUK(release_date)}</p>
            <p className="movie-details__runtime">Runtime: {runtime} minutes</p>
            <p className="movie-details__rating">Rating: {vote_average}</p>
            <p className="movie-details__genres">Genres: {genres.map((genre) => genre.name).join(', ')}</p>
          </div>
          <div className="movie-details__cast">
            <p>Cast:</p>
            <div className="movie-details__cast-images">
              {cast.map((person) => (
                <div key={person.id} className="movie-details__cast-image">
                  <img
                    className="movie-details__cast-image-poster"
                    src={`https://image.tmdb.org/t/p/w200/${person.profile_path}`}
                    alt={person.name}
                  />
                  <p className="movie-details__cast-image-name">{person.name}</p>
                  <Link to={`/cast/${person.id}`}>
                    <button className="movie-details__cast-image-button">View Details</button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
