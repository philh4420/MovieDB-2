import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Header.css';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [, setLocation] = useLocation(); // Get the setLocation function from useLocation

  const handleSearch = (e) => {
    e.preventDefault();

    // Input validation
    if (searchQuery.trim() === '') {
      // Display an error message or disable the submit button
      return;
    }

    const query = encodeURIComponent(searchQuery);
    window.history.pushState(null, '', `/search/${query}`);
    setLocation(`/search/${query}`); // Use setLocation directly

    setSearchQuery('');
  };

  return (
    <header className="header">
      <div className="header__details">
        <div className="header__logo">
          <Link href="/">
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" alt="Netflix Logo" />
          </Link>
        </div>
        <form onSubmit={handleSearch} className="header__search">
          <label htmlFor="searchInput" className="visually-hidden">
            Search For Movies and TV Shows
          </label>
          <input
            type="text"
            id="searchInput"
            placeholder="Search For Movies and TV Shows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">
            <FontAwesomeIcon icon="search" className="search-icon" />
          </button>
        </form>

        <div className="header__buttons">
          <Link href="/">
            <button className="header__home-button">Home</button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
