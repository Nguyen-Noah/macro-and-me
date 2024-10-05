import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes';  // Import the routes from the separate file

function App() {
  return (
    <Router>
        <AppRoutes /> 
    </Router>
  );
}

export default App;
