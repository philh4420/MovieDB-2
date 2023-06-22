import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'wouter';
import { Icon } from 'react-icons-kit';
import { facebook } from 'react-icons-kit/fa/facebook';
import { twitter } from 'react-icons-kit/fa/twitter';
import { instagram } from 'react-icons-kit/fa/instagram';
import { globe } from 'react-icons-kit/fa/globe';

import './MovieDetails.css';

const apiKey = 'e7811799fcbd2c5fe1c7eed7a7955b7d';

const formatDateUK = (dateString) => {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString('en-GB', options);

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day} ${formattedDate.split(' ')[1]} ${year}`;
};

const fetchMovieDetails = async (id) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US&append_to_response=external_ids`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

const fetchCast = async (id) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`
    );
    return response.data.cast;
  } catch (error) {
    console.error('Error fetching cast:', error);
    throw error;
  }
};

const fetchTrailers = async (id) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}&language=en-US`
    );
    return response.data.results.filter((video) =>
      video.type.toLowerCase().includes('trailer')
    );
  } catch (error) {
    console.error('Error fetching trailers:', error);
    throw error;
  }
};

const MovieDetails = (props) => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const details = await fetchMovieDetails(props.params.id);
        setMovieDetails(details);

        const castData = await fetchCast(props.params.id);
        setCast(castData);

        const trailerData = await fetchTrailers(props.params.id);
        if (trailerData.length > 0) {
          setTrailerUrl(trailerData[0].key);
        }
      } catch (error) {
        setError('Failed to fetch movie details. Please try again later.');
      }
    };

    fetchData();
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

  const renderSocialMediaLinks = () => {
    const { external_ids = {} } = movieDetails;
    const { facebook_id, twitter_id, instagram_id } = external_ids;
    const socialMediaLinks = [];

    if (facebook_id) {
      socialMediaLinks.push(
        <a
          key="facebook"
          className="movie-details__social-media-link"
          href={`https://www.facebook.com/${facebook_id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon icon={facebook} />
        </a>
      );
    }

    if (twitter_id) {
      socialMediaLinks.push(
        <a
          key="twitter"
          className="movie-details__social-media-link"
          href={`https://twitter.com/${twitter_id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon icon={twitter} />
        </a>
      );
    }

    if (instagram_id) {
      socialMediaLinks.push(
        <a
          key="instagram"
          className="movie-details__social-media-link"
          href={`https://www.instagram.com/${instagram_id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon icon={instagram} />
        </a>
      );
    }

    return socialMediaLinks;
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!movieDetails) {
    return <div className="cast-details__loading">Loading...</div>;
  }

  const {
    title,
    overview,
    release_date,
    runtime,
    vote_average,
    genres,
    poster_path,
    homepage,
  } = movieDetails;

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
        <img
          className="movie-details__poster"
          src={`https://image.tmdb.org/t/p/w500/${poster_path}`}
          alt={title}
        />

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
            <p className="movie-details__website">
              <Icon icon={globe} />
              <a
                className="movie-details__website-link"
                href={homepage}
                target="_blank"
                rel="noopener noreferrer"
              >
                Official Website
              </a>
            </p>
            <div className="movie-details__social-media">
              <p>Follow on Social Media:</p>
              <div className="movie-details__social-media-icons">
                {renderSocialMediaLinks()}
              </div>
            </div>
            <div className="movie-details__cast">
              <p>Cast:</p>
              <div className="movie-details__cast-images">
                {cast.slice(0, 5).map((actor) => (
                  <div className="movie-details__cast-image" key={actor.id}>
                    <Link to={`/person/${actor.id}`}>
                      <img
                        className="movie-details__cast-image-poster"
                        src={`https://image.tmdb.org/t/p/w185/${actor.profile_path}`}
                        alt={actor.name}
                      />
                    </Link>

                    <p className="movie-details__cast-image-name">{actor.name}</p>
                    <Link to={`/person/${actor.id}`}>
                      <button className="movie-details__cast-image-button">Actor Details</button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
