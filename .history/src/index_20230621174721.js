import React from 'react';
import { createRoot } from 'react-dom/client';
import { Router } from 'wouter';
import App from './App';

// Load environment variables
const dotenv = require('dotenv');
const env = dotenv.config().parsed;
process.env = { ...process.env, ...env };

createRoot(document.getElementById('root')).render(
  <Router>
    <App />
  </Router>
);
