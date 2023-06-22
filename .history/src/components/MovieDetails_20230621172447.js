import React from 'react';

const MovieDetails = ({ movie, isModalOpen, closeModal }) => {
  const { title, poster_path, overview, release_date, runtime, vote_average, genres, cast } = movie;

  return (
    <div className="movie-details">
      <h1 className="movie-details__title">{title}</h1>
      <div className="movie-details__container">
        <img className="movie-details__poster" src={`https://image.tmdb.org/t/p/w500${poster_path}`} alt={title} />
        <div className="movie-details__info">
          <p className="movie-details__overview">{overview}</p>
          <p className="movie-details__release-date">Release date: {release_date}</p>
          <p className="movie-details__runtime">Runtime: {runtime} minutes</p>
          <p className="movie-details__rating">Rating: {vote_average}/10</p>
          <p className="movie-details__genres">Genres: {genres.join(', ')}</p>
          <h2 className="movie-details__cast">Cast:</h2>
          <div className="movie-details__cast-images">
            {cast.map((actor, index) => (
              <div className="movie-details__cast-image" key={index}>
                <img className="movie-details__cast-image-poster" src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`} alt={actor.name} />
                <p className="movie-details__cast-image-name">{actor.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={isModalOpen ? 'modal' : 'modal hidden'}>
        <div className="modal__content">
          <span className="modal__close" onClick={closeModal}>&times;</span>
          <iframe
            title="Trailer"
            className="modal__video"
            src={`https://www.youtube.com/embed/${movie.trailer}?autoplay=1`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;