import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom sticky-top py-3">
      <div className="container">
        <NavLink className="navbar-brand d-flex align-items-center gap-2" to="/">
          <div className="d-flex align-items-center justify-content-center bg-dark border border-warning rounded-3 p-2 shadow">
            <span className="fs-4">🎬</span>
          </div>
          <div className="d-flex flex-column">
            <div className="d-flex align-items-center gap-2">
              <span className="brand-title">IUDigital Play</span>
              <span className="brand-badge">ADMIN</span>
            </div>
            <small className="text-muted" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>
              STREAMING &amp; CINE UNIVERSITARIO
            </small>
          </div>
        </NavLink>

        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-2 align-items-lg-center">
            <li className="nav-item">
              <NavLink className="nav-link nav-link-custom" to="/" end>
                <i className="bi bi-film me-1 text-danger"></i> Películas y Series
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link nav-link-custom" to="/generos">
                <i className="bi bi-tags me-1 text-warning"></i> Géneros
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link nav-link-custom" to="/directores">
                <i className="bi bi-person-video me-1 text-warning"></i> Directores
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link nav-link-custom" to="/productoras">
                <i className="bi bi-building me-1 text-warning"></i> Productoras
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link nav-link-custom" to="/tipos">
                <i className="bi bi-collection-play me-1 text-danger"></i> Tipos
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
