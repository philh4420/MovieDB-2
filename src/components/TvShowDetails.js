import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRoute, Link } from 'wouter';
import './TVShowDetails.css';

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
          `https://api.themoviedb.org/3/tv/${params.id}?api_key=${apiKey}&language=en-US`
        );
        setTVShowDetails(tvShowResponse.data);

        const creditsResponse = await axios.get(
          `https://api.themoviedb.org/3/tv/${params.id}/credits?api_key=${apiKey}`
        );
        setCast(creditsResponse.data.cast);

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
        console.log('Error fetching TV show details:', error);
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

  if (!tvShowDetails) {
    return <div>Loading...</div>;
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
              Episode Runtime: {episode_run_time[0]} minutes {/* Assuming there is only one runtime */}
            </p>
            <p className="tv-show-details__rating">Rating: {vote_average}</p>
            <p className="tv-show-details__genres">Genres: {genres.map((genre) => genre.name).join(', ')}</p>
          </div>
          <div className="tv-show-details__cast">
            <p>Cast:</p>
            <div className="tv-show-details__cast-images">
              {cast.map((person) => (
                <div key={person.id} className="tv-show-details__cast-image">
                  <Link to={`/cast/${person.id}`}>
                    <img
                      className="tv-show-details__cast-image-poster"
                      src={`https://image.tmdb.org/t/p/w200/${person.profile_path}`}
                      alt={person.name}
                    />
                  </Link>
                  <p className="tv-show-details__cast-image-name">{person.name}</p>
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

export default TVShowDetails;
