import React from 'react';
import { Router, Route } from 'wouter';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import SearchResults from './components/SearchResults';
import MovieDetails from './components/MovieDetails';
import CastDetails from './components/CastDetails';
import TVShowDetails from './components/TvShowDetails';
import './App.css';

// Add the Font Awesome icon to the library
library.add(faSearch);

const App = () => {
  return (
    <Router>
      <div>
        <Header />
        <Route path="/" component={Home} />
        <Route path="/search/:query" component={SearchResults} />
        <Route path="/movies/:id" component={MovieDetails} />
        <Route path="/tvshows/:id" component={TVShowDetails} />
        <Route path="/cast/:id" component={CastDetails} />
        <Footer />
      </div>
    </Router>
  );
};

export default App;
