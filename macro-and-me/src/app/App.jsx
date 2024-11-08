import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { useAuth } from "../AuthContext";

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <AppRoutes user={user} />
    </Router>
  );
}

export default App;
