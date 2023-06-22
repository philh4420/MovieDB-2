import React from 'react';
import { createRoot } from 'react-dom/client';
import { Router } from 'wouter';
import App from './App';


createRoot(document.getElementById('root')).render(
  <Router>
    <App />
  </Router>
);
