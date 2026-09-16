import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import MediaView from './views/MediaView';
import GenreView from './views/GenreView';
import DirectorView from './views/DirectorView';
import ProducerView from './views/ProducerView';
import TypeView from './views/TypeView';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />

        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<MediaView />} />
            <Route path="/generos" element={<GenreView />} />
            <Route path="/directores" element={<DirectorView />} />
            <Route path="/productoras" element={<ProducerView />} />
            <Route path="/tipos" element={<TypeView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="py-4 border-top border-warning border-opacity-25 mt-5 text-center text-muted small bg-black">
          <div className="container">
            <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
              <span className="fs-5">🎬</span>
              <span className="fw-bold text-white">IUDigital Play</span>
              <span className="badge bg-danger">4K STREAMING</span>
            </div>
            <p className="mb-1 text-muted">
              Plataforma de Administración y Publicación de Contenidos Multimedia
            </p>
            <p className="mb-0 text-secondary" style={{ fontSize: '0.78rem' }}>
              Ingeniería Web II &bull; Institución Universitaria Digital de Antioquia &bull; {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
