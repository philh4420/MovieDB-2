import React from 'react';
import { Icon } from 'react-icons-kit';
import { facebook, twitter, instagram, globe } from 'react-icons-kit/fa';

const MovieDetails = ({ movieDetails, cast, closeModal, openModal, isModalOpen, trailerUrl, error }) => {
  const renderSocialMediaLinks = () => {
    const { external_ids } = movieDetails;
    const { facebook_id, twitter_id, instagram_id } = external_ids || {};

    const socialMediaLinks = [];

    if (facebook_id) {
      socialMediaLinks.push(
        <a
          key="facebook"
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
    external_ids,
  } = movieDetails;

  return (
    <div className="movie-details">
      {/* Modal */}
      <div className="modal" style={{ display: isModalOpen ? 'block' : 'none' }}>
        <div className="modal__content">
          <span className="modal__close" onClick={closeModal}>
            &times;
          </span>
          <iframe
            title="Movie Trailer"
            className="modal__video"
            src={`https://www.youtube.com/embed/${trailerUrl}`}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Movie Details */}
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
            <p className="movie-details__release-date">Release Date: {release_date}</p>
            <p className="movie-details__runtime">Runtime: {runtime} minutes</p>
            <p className="movie-details__rating">Rating: {vote_average}</p>
            <p className="movie-details__genres">Genres: {genres.map((genre) => genre.name).join(', ')}</p>
            <p className="movie-details__website">
              <Icon icon={globe} />
              <a href={homepage} target="_blank" rel="noopener noreferrer">
                Website
              </a>
            </p>
            <div className="movie-details__social-media">{renderSocialMediaLinks()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
