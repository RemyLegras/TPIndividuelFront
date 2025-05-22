import axios from "axios";
import React, { useEffect, useState } from "react";

const CATEGORIES = [
  "Immobilier",
  "Emploi",
  "Véhicule",
  "Services",
  "Autre"
];

const Home = () => {
  const [publications, setPublications] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [price, setPrice] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userStats, setUserStats] = useState({ name: "", count: 0, id: "" });
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [editPublication, setEditPublication] = useState(null);
  const [detailPublication, setDetailPublication] = useState(null);

  useEffect(() => {
    fetchPublications();
    fetchUserStats();
  }, []);

  const fetchPublications = () => {
    axios
      .get("http://localhost:8080/publication")
      .then((response) => {
        setPublications(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération :", error);
      });
  };

  const fetchUserStats = () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios
      .get("http://localhost:8080/users/me", {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        setUserStats({
          name: res.data.name || res.data.username,
          count: res.data.publicationsCount || (res.data.publications ? res.data.publications.length : 0),
          id: res.data._id,
        });
      })
      .catch(() => {});
  };

  const handleCreateOrEditPublication = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("categories", JSON.stringify(categories));
    if (price !== "") formData.append("price", price);
    if (image) formData.append("image", image);

    if (editPublication) {
      axios
        .put(`http://localhost:8080/publication/${editPublication._id}`, formData, {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          resetForm();
          fetchPublications();
        })
        .catch((error) => {
          console.error("Erreur lors de la modification :", error);
        });
    } else {
      axios
        .post("http://localhost:8080/publication", formData, {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          resetForm();
          fetchPublications();
        })
        .catch((error) => {
          console.error("Erreur lors de la création :", error);
        });
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setImage(null);
    setCategories([]);
    setPrice("");
    setShowPopup(false);
    setEditPublication(null);
  };

  const handleDeletePublication = (id) => {
    if (!window.confirm("Supprimer cette annonce ?")) return;
    const token = localStorage.getItem("token");
    axios
      .delete(`http://localhost:8080/publication/${id}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then(() => fetchPublications())
      .catch((error) => {
        console.error("Erreur lors de la suppression :", error);
      });
  };

  const handleEditPublication = (publication) => {
    setEditPublication(publication);
    setTitle(publication.title);
    setContent(publication.content);
    setCategories(publication.categories || []);
    setPrice(publication.price !== undefined && publication.price !== null ? publication.price : "");
    setShowPopup(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleDeleteAccount = () => {
    if (!window.confirm("Supprimer votre compte ?")) return;
    const token = localStorage.getItem("token");
    axios
      .delete("http://localhost:8080/users/me", {
        headers: { Authorization: "Bearer " + token },
      })
      .then(() => {
        localStorage.removeItem("token");
        window.location.href = "/";
      });
  };

  const filteredPublications = publications.filter((pub) => {
    const matchSearch =
      pub.title.toLowerCase().includes(search.toLowerCase()) ||
      pub.content.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      !filterCategory ||
      (pub.categories && pub.categories.includes(filterCategory));
    return matchSearch && matchCategory;
  });

  return (
    <div>
      <div className="header">
        <button className="profile-btn" onClick={() => setShowProfile(true)}>
          Mon compte
        </button>
      </div>

      <h1 style={{ textAlign: "center", marginTop: "2rem" }}>
        Liste des annonces
      </h1>

      <div style={{ display: "flex", justifyContent: "center", margin: "2rem 0" }}>
        <input
          type="text"
          placeholder="Rechercher une annonce..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ marginRight: "1rem", padding: "0.5rem", borderRadius: "8px", border: "1px solid #ccc" }}
        />
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: "8px", border: "1px solid #ccc" }}
        >
          <option value="">Toutes catégories</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <ul className="publication-list">
        {filteredPublications.map((publication) => (
          <li key={publication._id}>
            <p style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
              {publication.title}
            </p>
            <p>
              {publication.content.length > 50
                ? publication.content.slice(0, 50) + "..."
                : publication.content}
            </p>
            {publication.categories && publication.categories.length > 0 && (
              <div style={{ marginBottom: "0.5rem" }}>
                {publication.categories.map((cat) => (
                  <span
                    key={cat}
                    style={{
                      background: "#e3f2fd",
                      color: "#1976d2",
                      borderRadius: "8px",
                      padding: "0.2rem 0.7rem",
                      marginRight: "0.5rem",
                      fontSize: "0.9rem",
                      display: "inline-block"
                    }}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}
            {publication.image && (
              <img
                src={`http://localhost:8080/uploads/${publication.image}`}
                alt="publication"
                style={{ maxWidth: "200px", marginBottom: "0.5rem" }}
              />
            )}
            <p>
              <em>
                {publication.author?.username ? `Auteur : ${publication.author.username}` : ""}
              </em>
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.2rem",
                marginTop: "0.5rem"
              }}
            >
              {publication.author?._id === userStats.id && (
                <>
                  <button
                    className="profile-btn"
                    style={{ background: "#e53935", padding: "0.5rem 0.7rem" }}
                    title="Supprimer"
                    onClick={() => handleDeletePublication(publication._id)}
                  >
                    <i className="fa fa-trash" aria-hidden="true"></i>
                  </button>
                  <button
                    className="profile-btn"
                    style={{ background: "#1976d2", padding: "0.5rem 0.7rem" }}
                    title="Modifier"
                    onClick={() => handleEditPublication(publication)}
                  >
                    <i className="fa fa-pencil" aria-hidden="true"></i>
                  </button>
                </>
              )}
              <button
                className="profile-btn"
                style={{ background: "#43a047" }}
                onClick={() => setDetailPublication(publication)}
              >
                En savoir plus
              </button>
            </div>
          </li>
        ))}
      </ul>

      {detailPublication && (
        <div
          className="popup-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.8)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          onClick={() => setDetailPublication(null)}
        >
          <div
            className="popup-content"
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "2rem",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative",
              wordBreak: "break-word",
              whiteSpace: "pre-line"
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              className="close-popup"
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                fontSize: "2rem",
                background: "none",
                border: "none",
                cursor: "pointer"
              }}
              onClick={() => setDetailPublication(null)}
            >
              &times;
            </button>
            <h2>{detailPublication.title}</h2>
            {detailPublication.price !== undefined && detailPublication.price !== null && detailPublication.price !== "" && (
              <p style={{ fontWeight: "bold", color: "#1976d2", fontSize: "1.1rem" }}>
                Prix : {detailPublication.price} €
              </p>
            )}
            <h3 style={{ marginTop: "1.5rem", marginBottom: "0.5rem" }}>Description</h3>
            <p style={{ margin: "1rem 0", wordBreak: "break-word", whiteSpace: "pre-line" }}>
              {detailPublication.content}
            </p>
            {detailPublication.categories && detailPublication.categories.length > 0 && (
              <div style={{ marginBottom: "1rem" }}>
                {detailPublication.categories.map((cat) => (
                  <span
                    key={cat}
                    style={{
                      background: "#e3f2fd",
                      color: "#1976d2",
                      borderRadius: "8px",
                      padding: "0.2rem 0.7rem",
                      marginRight: "0.5rem",
                      fontSize: "0.9rem",
                      display: "inline-block"
                    }}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}
            {detailPublication.image && (
              <img
                src={`http://localhost:8080/uploads/${detailPublication.image}`}
                alt="publication"
                style={{ maxWidth: "100%", marginBottom: "1rem", borderRadius: "8px" }}
              />
            )}
            <p>
              <em>
                {detailPublication.author?.username ? `Auteur : ${detailPublication.author.username}` : ""}
              </em>
            </p>
          </div>
        </div>
      )}

      <button className="plus-btn" onClick={() => { resetForm(); setShowPopup(true); }}>
        +
      </button>

      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div
            className="popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-popup" onClick={() => setShowPopup(false)}>
              &times;
            </button>
            <h2>{editPublication ? "Modifier l'annonce" : "Nouvelle annonce"}</h2>
            <form onSubmit={handleCreateOrEditPublication}>
              <input
                type="text"
                placeholder="Titre de la publication"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{ width: "100%", marginBottom: "1rem" }}
              />
              <input
                type="text"
                placeholder="Contenu"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                style={{ width: "100%", marginBottom: "1rem" }}
              />
              <input
                type="number"
                placeholder="Prix (optionnel)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={{ width: "100%", marginBottom: "1rem" }}
                min="0"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                style={{ marginBottom: "1rem" }}
              />
              <div style={{ marginBottom: "1rem" }}>
                {CATEGORIES.map((cat) => (
                  <label key={cat} style={{ marginRight: "1rem" }}>
                    <input
                      type="checkbox"
                      value={cat}
                      checked={categories.includes(cat)}
                      onChange={e => {
                        if (e.target.checked) {
                          setCategories([...categories, cat]);
                        } else {
                          setCategories(categories.filter(c => c !== cat));
                        }
                      }}
                    />
                    {cat}
                  </label>
                ))}
              </div>
              <button
                type="submit"
                className="profile-btn"
                style={{ width: "100%" }}
              >
                {editPublication ? "Modifier" : "Publier"}
              </button>
            </form>
          </div>
        </div>
      )}

      {showProfile && (
        <div className="popup-overlay" onClick={() => setShowProfile(false)}>
          <div
            className="popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-popup" onClick={() => setShowProfile(false)}>
              &times;
            </button>
            <h2>Mon compte</h2>
            <p>
              <strong>Nom :</strong> {userStats.name}
            </p>
            <button
              className="profile-btn"
              style={{ background: "#e53935", marginTop: "1rem" }}
              onClick={handleDeleteAccount}
            >
              Supprimer mon compte
            </button>
            <button
              className="profile-btn"
              style={{ background: "#888", marginTop: "1rem" }}
              onClick={handleLogout}
            >
              Déconnexion
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;