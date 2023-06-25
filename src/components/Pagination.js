import React from 'react';
import PropTypes from 'prop-types';

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="home__pagination">
    {currentPage > 1 && (
      <button
        className="home__pagination-button home__pagination-previous"
        onClick={() => onPageChange(currentPage - 1)}
      >
        &#8249;
      </button>
    )}
    <span className="home__pagination-page">
      Page {currentPage} of {totalPages}
    </span>
    {currentPage < totalPages && (
      <button
        className="home__pagination-button home__pagination-next"
        onClick={() => onPageChange(currentPage + 1)}
      >
        &#8250;
      </button>
    )}
  </div>
);

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
