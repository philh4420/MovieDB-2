import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRoute, Link } from 'wouter';
import { Icon } from 'react-icons-kit';
import { instagram } from 'react-icons-kit/fa/instagram';
import { twitter } from 'react-icons-kit/fa/twitter';
import { facebook } from 'react-icons-kit/fa/facebook';
import { globe } from 'react-icons-kit/fa/globe';
import './TVShowDetails.css';

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

const TVShowDetails = () => {
  const [tvShowDetails, setTVShowDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [, params] = useRoute('/tvshows/:id'); // Update the route path according to your setup
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTVShowDetails = async () => {
      try {
        const tvShowResponse = await axios.get(
          `https://api.themoviedb.org/3/tv/${params.id}?api_key=${apiKey}&language=en-US&append_to_response=credits,videos,external_ids`
        );
        setTVShowDetails(tvShowResponse.data);

        const { credits, videos, external_ids } = tvShowResponse.data;
        setCast(credits.cast);

        const trailers = videos.results.filter((video) => video.type.toLowerCase().includes('trailer'));
        if (trailers.length > 0) {
          setTrailerUrl(trailers[0].key);
        }

        setExternalLinks(external_ids);
      } catch (error) {
        console.log('Error fetching TV show details:', error);
      }
    };

    fetchTVShowDetails();
  }, [params.id]);

  const setExternalLinks = (externalIds) => {
    const { instagram_id, twitter_id, facebook_id, homepage } = externalIds;

    setLinks([
      { platform: 'Instagram', icon: instagram, id: instagram_id },
      { platform: 'Twitter', icon: twitter, id: twitter_id },
      { platform: 'Facebook', icon: facebook, id: facebook_id },
      { platform: 'Homepage', icon: globe, id: homepage },
    ]);
  };

  const openModal = () => {
    if (trailerUrl) {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTrailerUrl(null);
  };

  if (!tvShowDetails) {
    return <div className='cast-details__loading'>Loading...</div>;
  }

  const {
    name,
    overview,
    first_air_date,
    episode_run_time,
    vote_average,
    genres,
    poster_path,
    credits,
  } = tvShowDetails;

  const { cast: tvShowCast } = credits;

  const renderExternalLinks = (links) => {
    return links.map((link) => {
      const { platform, icon, id } = link;
      if (id) {
        const url = getSocialMediaUrl(platform.toLowerCase(), id);
        return (
          <a key={platform} href={url} target="_blank" rel="noopener noreferrer">
            <Icon icon={icon} size={20} />
          </a>
        );
      }
      return null;
    });
  };

  const getSocialMediaUrl = (platform, id) => {
    switch (platform) {
      case 'instagram':
        return `https://www.instagram.com/${id}`;
      case 'twitter':
        return `https://twitter.com/${id}`;
      case 'facebook':
        return `https://www.facebook.com/${id}`;
      case 'homepage':
        return id;
      default:
        return '';
    }
  };

  return (
    <div className='tv-show-details'>
      <div className='modal' style={{ display: isModalOpen ? 'block' : 'none' }}>
        <div className='modal__content'>
          <span className='modal__close' onClick={closeModal}>
            &times;
          </span>
          <iframe
            title='TV Show Trailer'
            className='modal__video'
            src={`https://www.youtube.com/embed/${trailerUrl}`}
            frameBorder='0'
            allowFullScreen
          ></iframe>
        </div>
      </div>
      <div className='tv-show-details__container'>
        <img className='tv-show-details__poster' src={`https://image.tmdb.org/t/p/w500/${poster_path}`} alt={name} />
        <div className='tv-show-details__info'>
          <button className='trailer-button' onClick={openModal}>
            Watch Trailer
          </button>
          <div>
            <h1 className='tv-show-details__title'>{name}</h1>
            <p className='tv-show-details__overview'>Overview: {overview}</p>
            <p className='tv-show-details__first-air-date'>First Air Date: {formatDateUK(first_air_date)}</p>
            <p className='tv-show-details__episode-runtime'>
              Episode Runtime: {episode_run_time[0]} minutes {/* Assuming there is only one runtime */}
            </p>
            <p className='tv-show-details__rating'>Rating: {vote_average}</p>
            <p className='tv-show-details__genres'>Genres: {genres.map((genre) => genre.name).join(', ')}</p>
          </div>
          <div className='tv-show-details__external-links'>
            {renderExternalLinks(links)}
          </div>
          <div className='tv-show-details__cast'>
            <p>Cast:</p>
            <div className='tv-show-details__cast-images'>
              {tvShowCast.map((person) => (
                <div key={person.id} className='tv-show-details__cast-image'>
                  <Link to={`/cast/${person.id}`}>
                    <img
                      className='tv-show-details__cast-image-poster'
                      src={`https://image.tmdb.org/t/p/w200/${person.profile_path}`}
                      alt={person.name}
                    />
                  </Link>
                  <p className='tv-show-details__cast-image-name'>{person.name}</p>
                  <Link to={`/cast/${person.id}`}>
                    <button className='movie-details__cast-image-button'>View Details</button>
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

export default TVShowDetails;
