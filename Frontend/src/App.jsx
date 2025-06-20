import { Route, Routes, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import ProblemHome from "./pages/problemhome";
import { useState } from "react";
import ProblemDetails from "./pages/ProblemDetails";
import RefreshHandler from './RefreshHandler';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/problem" element={<ProblemHome />} /> {/* Problem list page */}
        <Route path="/problems/:id" element={<ProblemDetails />} />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </>
  );
}

export default App;
