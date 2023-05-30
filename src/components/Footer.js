import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareTwitter } from '@fortawesome/free-brands-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faYoutubeSquare } from '@fortawesome/free-brands-svg-icons';
import './Footer.css';

const Footer = () => {
  // eslint-disable-next-line
  const [isActive, setIsActive] = useState(false);
  // eslint-disable-next-line
  const [location] = useLocation();

  return (
    <footer className="footer">
      <div className="footer__details">
        <div className="footer__logo">
          <Link href="/">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" alt="Netflix Logo" />
          </Link>
        </div>
        {/* <div className="footer__links">
          <ul className="footer__links-list">
            <li className={`footer__link-item ${isActive ? 'active' : ''}`} onClick={() => setIsActive(!isActive)}>
              Home
            </li>
            <li className={`footer__link-item ${location === '/terms' ? 'active' : ''}`}>
              <Link href="/terms">Terms of Service</Link>
            </li>
            <li className={`footer__link-item ${location === '/privacy' ? 'active' : ''}`}>
              <Link href="/privacy">Privacy Policy</Link>
            </li>
            <li className={`footer__link-item ${location === '/contact' ? 'active' : ''}`}>
              <Link href="/contact">Contact Us</Link>
            </li>
          </ul>
        </div> */}
        <div className="footer__social-icons">
          <ul className="footer__social-icons-list">
            <li className="footer__social-icon-item">
              <a href="/">
                <FontAwesomeIcon icon={faSquareTwitter} />
              </a>
            </li>
            <li className="footer__social-icon-item">
              <a href="/">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
            </li>
            <li className="footer__social-icon-item">
              <a href="/">
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
            </li>
            <li className="footer__social-icon-item">
              <a href="/">
                <FontAwesomeIcon icon={faYoutubeSquare} />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
