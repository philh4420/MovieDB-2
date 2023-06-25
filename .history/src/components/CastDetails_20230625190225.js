import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Icon } from 'react-icons-kit';
import { instagram } from 'react-icons-kit/fa/instagram';
import { twitter } from 'react-icons-kit/fa/twitter';
import { facebook } from 'react-icons-kit/fa/facebook';
import { globe } from 'react-icons-kit/fa/globe';
import { Link } from 'wouter';
import './CastDetails.css';

const apiKey = process.env.REACT_APP_API_KEY;

const CastDetails = (props) => {
  const [castDetails, setCastDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageSize, setPageSize] = useState(11);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchCastDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/person/${props.params.id}?api_key=${apiKey}&language=en-US&append_to_response=external_ids,homepage,movie_credits`
        );
        setCastDetails(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching cast details:', error);
        setError('Failed to fetch cast details. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchCastDetails();
  }, [props.params.id]);

  const renderKnownForMovies = () => {
    if (castDetails && castDetails.movie_credits) {
      const { movie_credits } = castDetails;
      const { cast } = movie_credits;

      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedMovies = cast.slice(startIndex, endIndex);

      return (
        <div className="cast-details__known-for">
          <h3 className="cast-details__known-for-title">Known For</h3>
          <div className="cast-details__known-for-movies">
            {paginatedMovies.map((movie) => (
              <div key={movie.id} className="cast-details__known-for-movie">
                <img
                  className="cast-details__known-for-movie-poster"
                  src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
                  alt={movie.title}
                />
                <div className="cast-details__known-for-movie-details">
                  <span className="cast-details__known-for-movie-title">{movie.title}</span>
                  <span className="cast-details__known-for-movie-character">{movie.character}</span>
                  <Link to={`/movies/${movie.id}`}>
                    <button className="cast-details__known-for-movie-button">View Details</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          {cast.length > pageSize && (
            <div className="cast-details__pagination">
              {renderPagination()}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const renderSocialMediaLinks = () => {
    if (castDetails && castDetails.external_ids) {
      const { external_ids } = castDetails;
      const socialMediaPlatforms = [
        {
          name: 'Instagram',
          icon: instagram,
          id: 'instagram_id',
        },
        {
          name: 'Twitter',
          icon: twitter,
          id: 'twitter_id',
        },
        {
          name: 'Facebook',
          icon: facebook,
          id: 'facebook_id',
        },
      ];

      return socialMediaPlatforms.map((platform) => {
        const { name, icon, id } = platform;
        const socialMediaId = external_ids[id];
        if (socialMediaId) {
          const url = getSocialMediaUrl(name.toLowerCase(), socialMediaId);
          return (
            <a key={name} href={url} target="_blank" rel="noopener noreferrer">
              <Icon icon={icon} size={20} />
            </a>
          );
        }
        return null;
      });
    }
    return null;
  };

  const getSocialMediaUrl = (platform, id) => {
    switch (platform) {
      case 'instagram':
        return `https://www.instagram.com/${id}`;
      case 'twitter':
        return `https://twitter.com/${id}`;
      case 'facebook':
        return `https://www.facebook.com/${id}`;
      default:
        return '';
    }
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(castDetails.movie_credits.cast.length / pageSize);
    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
      <ul className="cast-details__pagination-list">
        {pages.map((page) => (
          <li
            key={page}
            className={`cast-details__pagination-item ${page === currentPage ? 'active' : ''}`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </li>
        ))}
      </ul>
    );
  };

  if (isLoading) {
    return <div className="cast-details__loading">Loading...</div>;
  }

  if (error) {
    return <div className="cast-details__error">{error}</div>;
  }

  if (!castDetails) {
    return null; // Render nothing if castDetails is still null after loading
  }

  const {
    name,
    profile_path,
    biography,
    birthday,
    place_of_birth,
    also_known_as,
    known_for_department,
    gender,
    homepage,
  } = castDetails;

  return (
    <div className="cast-details">
      <div className="cast-details__header">
        <img
          className="cast-details__profile-image"
          src={`https://image.tmdb.org/t/p/w500/${profile_path}`}
          alt={name}
        />
      </div>
      <div className="cast-details__content">
        <div className="cast-details__name">{name}</div>
        <div className="cast-details__biography">{biography}</div>
        <div className="cast-details__personal-info">
          <span className="cast-details__personal-info-label">Birthday:</span> {birthday}
        </div>
        <div className="cast-details__personal-info">
          <span className="cast-details__personal-info-label">Place of Birth:</span> {place_of_birth}
        </div>
        {also_known_as && (
          <div className="cast-details__personal-info">
            <span className="cast-details__personal-info-label">Also Known As:</span>{' '}
            {also_known_as.map((name) => (
              <span key={name}>{name}</span>
            ))}
          </div>
        )}
        <div className="cast-details__personal-info">
          <span className="cast-details__personal-info-label">Known for Department:</span>{' '}
          {known_for_department}
        </div>
        <div className="cast-details__personal-info">
          <span className="cast-details__personal-info-label">Gender:</span>{' '}
          {gender === 1 ? 'Female' : 'Male'}
        </div>
        <div className="cast-details__personal-info">
          <span className="cast-details__personal-info-label">Homepage:</span>{' '}
          <a href={homepage} target="_blank" rel="noopener noreferrer">
            <Icon icon={globe} size={20} />
          </a>
        </div>
        <div className="cast-details__social-links">{renderSocialMediaLinks()}</div>
        {renderKnownForMovies()}
      </div>
    </div>
  );
};

export default CastDetails;
