import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRoute, Link } from 'wouter';
import { Icon } from 'react-icons-kit';
import { instagram } from 'react-icons-kit/fa/instagram';
import { twitter } from 'react-icons-kit/fa/twitter';
import { facebook } from 'react-icons-kit/fa/facebook';
import { globe } from 'react-icons-kit/fa/globe';
import Modal from 'react-modal';
import './TVShowDetails.css';

const apiKey = process.env.REACT_APP_API_KEY;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

const TVShowDetails = () => {
  const [showDetails, setShowDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [, params] = useRoute('/tvshows/:id');
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [externalLinks, setExternalLinks] = useState([]);

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const showResponse = await axios.get(
          `https://api.themoviedb.org/3/tv/${params.id}?api_key=${apiKey}&language=en-US`
        );
        setShowDetails(showResponse.data);

        const castResponse = await axios.get(
          `https://api.themoviedb.org/3/tv/${params.id}/credits?api_key=${apiKey}`
        );
        setCast(castResponse.data.cast);

        const externalIdsResponse = await axios.get(
          `https://api.themoviedb.org/3/tv/${params.id}/external_ids?api_key=${apiKey}`
        );
        const links = [];
        if (externalIdsResponse.data.imdb_id) {
          links.push({ platform: 'imdb', icon: globe, id: externalIdsResponse.data.imdb_id });
        }
        if (externalIdsResponse.data.facebook_id) {
          links.push({ platform: 'facebook', icon: facebook, id: externalIdsResponse.data.facebook_id });
        }
        if (externalIdsResponse.data.instagram_id) {
          links.push({ platform: 'instagram', icon: instagram, id: externalIdsResponse.data.instagram_id });
        }
        if (externalIdsResponse.data.twitter_id) {
          links.push({ platform: 'twitter', icon: twitter, id: externalIdsResponse.data.twitter_id });
        }
        if (showResponse.data.homepage) {
          links.push({ platform: 'homepage', icon: globe, id: showResponse.data.homepage });
        }
        setExternalLinks(links);

        const videosResponse = await axios.get(
          `https://api.themoviedb.org/3/tv/${params.id}/videos?api_key=${apiKey}&language=en-US`
        );
        const trailers = videosResponse.data.results.filter((video) =>
          video.type.toLowerCase().includes('trailer')
        );
        if (trailers.length > 0) {
          setTrailerUrl(trailers[0].key);
        }
      } catch (error) {
        console.error('Error fetching TV show details:', error);
      }
    };

    fetchShowDetails();
  }, [params.id]);

  const openModal = () => setModalIsOpen(true);

  const closeModal = () => setModalIsOpen(false);

  if (!showDetails) {
    return <div className="show-details__loading">Loading...</div>;
  }

  const { name, overview, first_air_date, episode_run_time, vote_average, genres, poster_path } = showDetails;

  return (
    <div className="show-details">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="TV Show Trailer Modal"
        className="modal"
      >
        <div className="modal__content">
          <span className="modal__close" onClick={closeModal}>&times;</span>
          {trailerUrl && (
            <iframe
              title="TV Show Trailer"
              className="modal__video"
              src={`https://www.youtube.com/embed/${trailerUrl}?autoplay=1`}
              frameBorder="0"
              allow="autoplay"
              allowFullScreen
            ></iframe>
          )}
        </div>
      </Modal>
      <div className="show-details__info">
        <img className="show-details__poster" src={`https://image.tmdb.org/t/p/w500${poster_path}`} alt={name} />
        <div className="show-details__content">
          <h1 className="show-details__title">{name}</h1>
          <p className="show-details__overview">{overview}</p>
          <p className="show-details__date">First Air Date: {formatDate(first_air_date)}</p>
          <p className="show-details__runtime">Episode Runtime: {episode_run_time[0]} minutes</p>
          <p className="show-details__rating">Rating: {vote_average}</p>
          <p className="show-details__genres">Genres: {genres.map(genre => genre.name).join(', ')}</p>
          <button className="show-details__trailer-button" onClick={openModal}>
            Watch Trailer
          </button>
        </div>
      </div>
      <div className="show-details__external-links">
        {externalLinks.map((link) => (
          <a
            key={link.platform}
            href={link.id}
            target="_blank"
            rel="noopener noreferrer"
            className="show-details__external-link"
          >
            <Icon icon={link.icon} size={20} />
          </a>
        ))}
      </div>
      <di className="show-details__cast">
        <p>Cast:</p>
        <div className="show-details__cast-images">
          {cast.map((person) => (
            <div key={person.id} className="show-details__cast-image">
              <Link to={`/cast/${person.id}`}>
                <img
                  className="show-details__cast-image-poster"
                  src={`https://image.tmdb.org/t/p/w200/${person.profile_path}`}
                  alt={person.name}
                />
              </Link>
              <p className="show-details__cast-image-name">{person.name}</p>
              <Link to={`/cast/${person.id}`}>
                <button className="show-details__cast-image-button">View Details</button>
              </Link>
            </div>
          ))}
        </div>
    </div>
    </div >
  );
};

export default TVShowDetails;
