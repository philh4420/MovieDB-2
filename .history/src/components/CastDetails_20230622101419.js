import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Icon } from 'react-icons-kit';
import { instagram } from 'react-icons-kit/fa/instagram';
import { twitter } from 'react-icons-kit/fa/twitter';
import { facebook } from 'react-icons-kit/fa/facebook';
import { globe } from 'react-icons-kit/fa/globe';
import './CastDetails.css';

const apiKey = 'e7811799fcbd2c5fe1c7eed7a7955b7d';

const CastDetails = (props) => {
  const [castDetails, setCastDetails] = useState(null);

  useEffect(() => {
    const fetchCastDetails = async () => {
      try {
        const response = await axios.get(
          'https://api.themoviedb.org/3/person/2542319?api_key=e7811799fcbd2c5fe1c7eed7a7955b7d&language=en-US&append_to_response=external_ids,homepage'
        );
        setCastDetails(response.data);
      } catch (error) {
        console.log('Error fetching cast details:', error);
      }
    };

    fetchCastDetails();
  }, []);

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

  if (!castDetails) {
    return <div className="cast-details__loading">Loading...</div>;
  }

  const {
    name,
    profile_path,
    biography,
    birthday,
    place_of_birth,
    also_known_as,
    known_for_department,
    known_for,
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
        {known_for && (
          <div className="cast-details__personal-info">
            <span className="cast-details__personal-info-label">Known For:</span>{' '}
            {known_for.map((movie) => (
              <span key={movie.id}>{movie.title}</span>
            ))}
          </div>
        )}
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
      </div>
    </div>
  );
};

export default CastDetails;
