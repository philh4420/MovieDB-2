// App.js
import React from 'react';
import { Router, Route } from 'wouter';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import SearchResults from './components/SearchResults';
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
        <Footer />
      </div>
    </Router>
  );
};

export default App;
