// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { auth } from "../firebase";
import AppRoutes from "./AppRoutes";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);  
      } else {
        setUser(null); 
      }
    });

    return () => unsubscribe();  
  }, []);

  return (
    <Router>
      <AppRoutes user={user} />
    </Router>
  );
}

export default App;
