import { Routes, Route } from "react-router-dom";
import PrivateRoute from "../pages/PrivateRoute.jsx";

// pages
import Login from "../pages/Login.jsx";
import Home from "../pages/Home.jsx";
import Error from "../pages/Error.jsx";

import MouldSummary from "../pages/MouldSummary.jsx";
import MouldHCSummary from "../pages/MouldHCSummary.jsx";
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />



      <Route
        path="/MouldSummary"
        element={
          <PrivateRoute>
            <MouldSummary />
          </PrivateRoute>
        }
      />


      <Route
        path="/MouldHCSummary"
        element={
          <PrivateRoute>
            <MouldHCSummary />
          </PrivateRoute>
        }
      />


      {/* Catch-all route */}
      <Route path="*" element={<Error />} />
    </Routes>
  );
}
