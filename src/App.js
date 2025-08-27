import React, { useState } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Loginpage from "./Loginpage";
import Portal from "./Portal";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Default route → Login page */}
        <Route 
          path="/" 
          element={<Loginpage setIsLoggedIn={setIsLoggedIn} />} 
        />

        {/* Protected Portal route */}
        <Route
          path="/portal"
          element={
            isLoggedIn ? (
              <Portal setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Catch-all route → redirect to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;