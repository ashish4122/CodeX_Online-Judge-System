import { Route, Routes, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import Problem from "./pages/Problem";
import { useState } from "react";
import RefreshHandler from './RefreshHandler';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/home" element={<Home />} /> {/* ← no PrivateRoute */}
        <Route path="/problem" element={<Problem />} />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </>
  );
}

export default App;
