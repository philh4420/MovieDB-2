import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRoute, Link } from 'wouter';
import { Icon } from 'react-icons-kit';
import { instagram } from 'react-icons-kit/fa/instagram';
import { twitter } from 'react-icons-kit/fa/twitter';
import { facebook } from 'react-icons-kit/fa/facebook';
import { globe } from 'react-icons-kit/fa/globe';
import './TVShowDetails.css';

const apiKey = process.env.REACT_APP_API_KEY;

const formatDateUK = (dateString) => {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString('en-GB', options);

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day} ${formattedDate.split(' ')[1]} ${year}`;
};

const TVShowDetails = () => {
  const [tvShowDetails, setTVShowDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [, params] = useRoute('/tvshows/:id');
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [links, setLinks] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [castLoading, setCastLoading] = useState(true);

  useEffect(() => {
    const fetchTVShowDetails = async () => {
      setIsLoading(true);
      setCastLoading(true);
      try {
        const tvShowResponse = await axios.get(
          `https://api.themoviedb.org/3/tv/${params.id}?api_key=${apiKey}&language=en-US`
        );
        setTVShowDetails(tvShowResponse.data);

        const creditsResponse = await axios.get(
          `https://api.themoviedb.org/3/tv/${params.id}/credits?api_key=${apiKey}`
        );
        setCast(creditsResponse.data.cast);
        setCastLoading(false);

        const externalIdsResponse = await axios.get(
          `https://api.themoviedb.org/3/tv/${params.id}/external_ids?api_key=${apiKey}`
        );
        const externalLinks = [];
        if (externalIdsResponse.data.imdb_id) {
          externalLinks.push({ platform: 'imdb', icon: globe, id: externalIdsResponse.data.imdb_id });
        }
        if (externalIdsResponse.data.facebook_id) {
          externalLinks.push({ platform: 'facebook', icon: facebook, id: externalIdsResponse.data.facebook_id });
        }
        if (externalIdsResponse.data.instagram_id) {
          externalLinks.push({ platform: 'instagram', icon: instagram, id: externalIdsResponse.data.instagram_id });
        }
        if (externalIdsResponse.data.twitter_id) {
          externalLinks.push({ platform: 'twitter', icon: twitter, id: externalIdsResponse.data.twitter_id });
        }
        if (tvShowResponse.data.homepage) {
          externalLinks.push({ platform: 'homepage', icon: globe, id: tvShowResponse.data.homepage });
        }
        setLinks(externalLinks);

        const videosResponse = await axios.get(
          `https://api.themoviedb.org/3/tv/${params.id}/videos?api_key=${apiKey}&language=en-US`
        );
        const trailers = videosResponse.data.results.filter((video) =>
          video.type.toLowerCase().includes('trailer')
        );
        if (trailers.length > 0) {
          setTrailerUrl(trailers[0].key);
        }
        setIsLoading(false);
      } catch (error) {
        setError(`Error fetching TV show details: ${error}`);
      }
    };

    fetchTVShowDetails();
  }, [params.id]);

  const openModal = () => {
    if (trailerUrl) {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTrailerUrl(null);
  };

  if (error) {
    return <div className="tv-show-details__error">{error}</div>;
  }

  if (isLoading) {
    return <div className="tv-show-details__loading">Loading...</div>;
  }

  const { name, overview, first_air_date, episode_run_time, vote_average, genres, poster_path } = tvShowDetails;

  return (
    <div className="tv-show-details">
      <div className="modal" style={{ display: isModalOpen ? 'block' : 'none' }}>
        <div className="modal__content">
          <span className="modal__close" onClick={closeModal}>&times;</span>
          <iframe
            title="TV Show Trailer"
            className="modal__video"
            src={`https://www.youtube.com/embed/${trailerUrl}`}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      </div>
      <div className="tv-show-details__container">
        <img className="tv-show-details__poster" src={`https://image.tmdb.org/t/p/w500/${poster_path}`} alt={name} />
        <div className="tv-show-details__info">
          <button className="trailer-button" onClick={openModal}>
            Watch Trailer
          </button>
          <div>
            <h1 className="tv-show-details__title">{name}</h1>
            <p className="tv-show-details__overview">Overview: {overview}</p>
            <p className="tv-show-details__first-air-date">First Air Date: {formatDateUK(first_air_date)}</p>
            <p className="tv-show-details__episode-runtime">
              Episode Runtime: {episode_run_time[0]} minutes
            </p>
            <p className="tv-show-details__rating">Rating: {vote_average}</p>
            <p className="tv-show-details__genres">Genres: {genres.map((genre) => genre.name).join(', ')}</p>
            <div className="tv-show-details__external-links">
              {links.map((link) => (
                <a
                  key={link.platform}
                  href={link.id}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tv-show-details__external-link"
                >
                  <Icon icon={link.icon} size={20} />
                </a>
              ))}
            </div>
          </div>
          <div className="tv-show-details__cast">
            <p>Cast:</p>
            {castLoading ? (
              <div>Loading Cast...</div>
            ) : (
              <div className="tv-show-details__cast-images">
                {cast.map((person) => (
                  <div key={person.id} className="tv-show-details__cast-image">
                    <Link to={`/cast/${person.id}`}>
                      <img
                        src={`https://image.tmdb.org/t/p/w500/${person.profile_path}`}
                        alt={person.name}
                      />
                      <p>{person.name}</p>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TVShowDetails;
