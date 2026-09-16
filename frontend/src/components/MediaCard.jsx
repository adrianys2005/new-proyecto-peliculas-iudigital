import React from 'react';

const MediaCard = ({ media, onEdit, onDelete }) => {
  const fallbackImage = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60';

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
      <div className="card media-card h-100">
        <div className="poster-container">
          <img
            src={media.imagenPortada || fallbackImage}
            alt={media.titulo}
            className="poster-img"
            onError={(e) => {
              e.target.src = fallbackImage;
            }}
          />
          <div className="poster-overlay"></div>
          {media.anioEstreno && <span className="year-badge">★ {media.anioEstreno}</span>}
          {media.tipo?.nombre && <span className="type-badge">{media.tipo.nombre}</span>}
        </div>

        <div className="card-body d-flex flex-column p-3">
          <div className="mb-2 d-flex align-items-center justify-content-between">
            <span className="genre-tag">
              <i className="bi bi-tag-fill me-1"></i>
              {media.generoPrincipal?.nombre || 'Género'}
            </span>
            <small className="text-muted" style={{ fontSize: '0.75rem' }}>
              {media.serial}
            </small>
          </div>

          <h5 className="card-title fw-bold text-white mb-2 text-truncate" title={media.titulo}>
            {media.titulo}
          </h5>

          <p className="card-text text-muted small flex-grow-1 mb-3" style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: '1.4'
          }}>
            {media.sinopsis || 'Sin sinopsis disponible.'}
          </p>

          <div className="pt-2 mb-3 small text-muted border-top border-secondary border-opacity-25">
            <div className="d-flex align-items-center mb-1 text-truncate">
              <i className="bi bi-camera-reels-fill me-2 text-warning"></i>
              <span className="text-truncate">
                <strong className="text-light">Dir:</strong> {media.directorPrincipal?.nombres || 'No asignado'}
              </span>
            </div>
            <div className="d-flex align-items-center text-truncate">
              <i className="bi bi-buildings-fill me-2 text-danger"></i>
              <span className="text-truncate">
                <strong className="text-light">Prod:</strong> {media.productora?.nombre || 'No asignada'}
              </span>
            </div>
          </div>

          <div className="d-flex gap-2 mt-auto">
            {media.url && (
              <a
                href={media.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-primary-custom flex-grow-1 d-flex align-items-center justify-content-center gap-1"
              >
                <i className="bi bi-play-fill fs-6"></i> Reproducir
              </a>
            )}
            <button
              className="btn btn-sm btn-outline-gold"
              onClick={() => onEdit(media)}
              title="Editar"
            >
              <i className="bi bi-pencil-square"></i>
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => onDelete(media._id, media.titulo)}
              title="Eliminar"
            >
              <i className="bi bi-trash3"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaCard;
