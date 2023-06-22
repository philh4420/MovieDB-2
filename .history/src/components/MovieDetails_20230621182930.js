import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'wouter';
import { Icon } from 'react-icons-kit';
import { facebook, twitter, instagram, globe } from 'react-icons-kit/fa';

import './MovieDetails.css';

const apiKey = 'e7811799fcbd2c5fe1c7eed7a7955b7d';

const formatDateUK = (dateString) => {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString('en-GB', options);

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return ${ day } ${ formattedDate.split(' ')[1] } ${ year };
};

const fetchMovieDetails = async (id) => {
  try {
    const response = await axios.get(
      https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

const fetchCast = async (id) => {
  try {
    const response = await axios.get(
      https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}
    );
    return response.data.cast;
  } catch (error) {
    console.error('Error fetching cast:', error);
    throw error;
  }
};

const fetchTrailers = async (id) => {
  try {
    const response = await axios.get(
      https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}&language=en-US
    );
    return response.data.results.filter((video) =>
      video.type.toLowerCase().includes('trailer')
    );
  } catch (error) {
    console.error('Error fetching trailers:', error);
    throw error;
  }
};

const MovieDetails = (props) => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const details = await fetchMovieDetails(props.params.id);
        setMovieDetails(details);

