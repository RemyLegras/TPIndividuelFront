import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setIsValid(false);
      return;
    }
    axios
      .get("http://localhost:8080/users/me", {
        headers: { Authorization: "Bearer " + token },
      })
      .then(() => setIsValid(true))
      .catch(() => {
        localStorage.removeItem("token");
        setIsValid(false);
      });
  }, [token]);

  if (isValid === null) {
    return null;
  }

  if (!isValid) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;