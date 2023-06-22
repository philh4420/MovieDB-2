import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Icon } from 'react-icons-kit';
import { instagram } from 'react-icons-kit/fa/instagram';
import { twitter } from 'react-icons-kit/fa/twitter';
import { facebook } from 'react-icons-kit/fa/facebook';
import { link } from 'react-icons-kit/fa/link';
import './CastDetails.css';

const apiKey = 'e7811799fcbd2c5fe1c7eed7a7955b7d';

const CastDetails = (props) => {
  const [castDetails, setCastDetails] = useState(null);

  useEffect(() => {
    const fetchCastDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/person/${props.params.id}?api_key=${apiKey}&language=en-US`
        );
        setCastDetails(response.data);
      } catch (error) {
        console.log('Error fetching cast details:', error);
      }
    };

    fetchCastDetails();
  }, [props.params.id]);

  const renderSocialLinks = () => {
    if (castDetails && castDetails.external_ids) {
      const { external_ids } = castDetails;
      const socialMediaPlatforms = [
        {
          name: 'Instagram',
          icon: instagram,
          url: `https://www.instagram.com/${external_ids.instagram_id}`,
        },
        {
          name: 'Twitter',
          icon: twitter,
          url: `https://twitter.com/${external_ids.twitter_id}`,
        },
        {
          name: 'Facebook',
          icon: facebook,
          url: `https://www.facebook.com/${external_ids.facebook_id}`,
        },
        {
          name: 'Homepage',
          icon: link,
          url: castDetails.homepage,
        },
      ];

      return socialMediaPlatforms.map((platform) => {
        const { name, icon, url } = platform;
        if (url) {
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
        <div className="cast-details__personal-info">
          <span className="cast-details__personal-info-label">Also Known As:</span>{' '}
          {also_known_as && also_known_as.join(', ')}
        </div>
        <div className="cast-details__personal-info">
          <span className="cast-details__personal-info-label">Known for Department:</span>{' '}
          {known_for_department}
        </div>
        <div className="cast-details__personal-info">
          <span className="cast-details__personal-info-label">Known For:</span>{' '}
          {known_for && known_for.map((movie) => movie.title).join(', ')}
        </div>
        <div className="cast-details__personal-info">
          <span className="cast-details__personal-info-label">Gender:</span> {gender === 1 ? 'Female' : 'Male'}
        </div>
      </div>
      <div className="cast-details__social-links">{renderSocialLinks()}</div>
    </div>
  );
};

export default CastDetails;
