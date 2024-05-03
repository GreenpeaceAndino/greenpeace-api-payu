import React from "react";
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
