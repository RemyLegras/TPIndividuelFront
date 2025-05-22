import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    axios
      .post("http://localhost:8080/users/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        navigate("/home");
      })
      .catch((error) => {
        setError(error.response.data.error);
      });
  };

  return (
    <div className="login100-container">
      <div className="wrap-login100">
        <form className="login100-form" onSubmit={handleLogin}>
          <span className="login100-form-title">Connexion</span>

          {error && (
            <div style={{ color: "red", marginBottom: "1rem", textAlign: "center" }}>
              {error}
            </div>
          )}

          <div className="wrap-input100">
            <input
              className="input100"
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <span className="symbol-input100">
              <i className="fa fa-envelope" aria-hidden="true"></i>
            </span>
          </div>

          <div className="wrap-input100">
            <input
              className="input100"
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="symbol-input100">
              <i className="fa fa-lock" aria-hidden="true"></i>
            </span>
          </div>

          <button className="login100-form-btn" type="submit">
            Connexion
          </button>

          <div className="text-center p-t-136">
            <a className="txt2" href="/register">
              Création de compte
              <i className="fa fa-long-arrow-right m-l-5" aria-hidden="true"></i>
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;