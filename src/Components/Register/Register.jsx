import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Login/Login.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");
    axios
      .post("http://localhost:8080/users/register", {
        email: email,
        password: password,
        username: username,
      })
      .then(() => {
        alert("Compte créé avec succès");
        navigate("/");
      })
      .catch((error) => {
        setError(error.response.data.error);
      });
  };

  return (
    <div className="login100-container">
      <div className="wrap-login100">
        <form className="login100-form" onSubmit={handleRegister}>
          <span className="login100-form-title">Créer un compte</span>

          {error && (
            <div style={{ color: "red", margin: "1rem 0", textAlign: "center" }}>
              {error}
            </div>
          )}

          <div className="wrap-input100">
            <input
              className="input100"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <span className="symbol-input100">
              <i className="fa fa-user" aria-hidden="true"></i>
            </span>
          </div>

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
            S'inscrire
          </button>

          <div className="text-center p-t-136">
            <a className="txt2" href="/">
              Déjà un compte ? Se connecter
              <i className="fa fa-long-arrow-left m-l-5" aria-hidden="true"></i>
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;