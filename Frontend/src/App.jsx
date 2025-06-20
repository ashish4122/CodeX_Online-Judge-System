import { Route, Routes, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage"; // Combined Login+Signup
import Home from "./pages/Home";
import Problem from "./pages/Problem";
import { useState } from "react";
import RefreshHandler from './RefreshHandler';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/auth" />;
  };

  return (
    <>
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        <Route path="*" element={<Navigate to="/auth" />} />
        <Route path="/problem" element={<Problem></Problem>}/>
      </Routes>
    </>
  );
}

export default App;
