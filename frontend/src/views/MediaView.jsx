import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import MediaCard from '../components/MediaCard';
import { getMediaList, createMedia, updateMedia, deleteMedia } from '../services/mediaService';
import { getGenres } from '../services/genreService';
import { getDirectors } from '../services/directorService';
import { getProducers } from '../services/producerService';
import { getTypes } from '../services/typeService';

const MediaView = () => {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Relaciones cargadas para los Selects
  const [activeGenres, setActiveGenres] = useState([]);
  const [activeDirectors, setActiveDirectors] = useState([]);
  const [activeProducers, setActiveProducers] = useState([]);
  const [types, setTypes] = useState([]);

  // Control del modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    serial: '',
    titulo: '',
    sinopsis: '',
    url: '',
    imagenPortada: '',
    anioEstreno: new Date().getFullYear(),
    generoPrincipal: '',
    directorPrincipal: '',
    productora: '',
    tipo: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [mediaData, genresData, directorsData, producersData, typesData] = await Promise.all([
        getMediaList(),
        getGenres(),
        getDirectors(),
        getProducers(),
        getTypes()
      ]);

      setMediaList(mediaData);
      setActiveGenres(genresData.filter((g) => g.estado === 'Activo'));
      setActiveDirectors(directorsData.filter((d) => d.estado === 'Activo'));
      setActiveProducers(producersData.filter((p) => p.estado === 'Activo'));
      setTypes(typesData);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error de Conexión',
        text: 'No se pudieron cargar los datos del catálogo.',
        background: '#15161e',
        color: '#fff',
        confirmButtonColor: '#e50914'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleOpenModal = (media = null) => {
    if (media) {
      setIsEditing(true);
      setCurrentId(media._id);
      setFormData({
        serial: media.serial || '',
        titulo: media.titulo || '',
        sinopsis: media.sinopsis || '',
        url: media.url || '',
        imagenPortada: media.imagenPortada || '',
        anioEstreno: media.anioEstreno || new Date().getFullYear(),
        generoPrincipal: media.generoPrincipal?._id || media.generoPrincipal || '',
        directorPrincipal: media.directorPrincipal?._id || media.directorPrincipal || '',
        productora: media.productora?._id || media.productora || '',
        tipo: media.tipo?._id || media.tipo || ''
      });
    } else {
      setIsEditing(false);
      setCurrentId(null);
      setFormData({
        serial: '',
        titulo: '',
        sinopsis: '',
        url: '',
        imagenPortada: '',
        anioEstreno: new Date().getFullYear(),
        generoPrincipal: activeGenres[0]?._id || '',
        directorPrincipal: activeDirectors[0]?._id || '',
        productora: activeProducers[0]?._id || '',
        tipo: types[0]?._id || ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.serial.trim() || !formData.titulo.trim() || !formData.url.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos Incompletos',
        text: 'Serial, Título y URL son campos obligatorios.',
        background: '#15161e',
        color: '#fff',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }
    if (!formData.generoPrincipal || !formData.directorPrincipal || !formData.productora || !formData.tipo) {
      Swal.fire({
        icon: 'warning',
        title: 'Relaciones Requeridas',
        text: 'Debes seleccionar Género, Director, Productora y Tipo válidos.',
        background: '#15161e',
        color: '#fff',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    try {
      if (isEditing) {
        await updateMedia(currentId, formData);
        Swal.fire({
          icon: 'success',
          title: '¡Actualizado!',
          text: 'Producción audiovisual actualizada correctamente.',
          background: '#15161e',
          color: '#fff',
          confirmButtonColor: '#e50914'
        });
      } else {
        await createMedia(formData);
        Swal.fire({
          icon: 'success',
          title: '¡Publicada!',
          text: 'Producción agregada al catálogo exitosamente.',
          background: '#15161e',
          color: '#fff',
          confirmButtonColor: '#e50914'
        });
      }
      handleCloseModal();
      loadData();
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.msg || 'Error al guardar la producción.';
      Swal.fire({
        icon: 'error',
        title: 'Error de Validación',
        text: msg,
        background: '#15161e',
        color: '#fff',
        confirmButtonColor: '#e50914'
      });
    }
  };

  const handleDelete = (id, titulo) => {
    Swal.fire({
      title: '¿Eliminar producción?',
      text: `Se eliminará "${titulo}" del catálogo de entretenimiento.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e50914',
      cancelButtonColor: '#374151',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#15161e',
      color: '#fff'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteMedia(id);
          Swal.fire({
            icon: 'success',
            title: '¡Eliminada!',
            text: 'La producción ha sido removida.',
            background: '#15161e',
            color: '#fff',
            confirmButtonColor: '#e50914'
          });
          loadData();
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar la producción.',
            background: '#15161e',
            color: '#fff',
            confirmButtonColor: '#e50914'
          });
        }
      }
    });
  };

  const filteredMedia = mediaList.filter((m) => {
    const matchesSearch = m.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.generoPrincipal?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.directorPrincipal?.nombres?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || m.tipo?._id === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="container py-4">
      {/* Hero Banner (Inspirado en BiblioTech con estética Cine) */}
      <div className="hero-banner mb-5 text-center text-lg-start">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 mb-3 rounded-pill bg-dark border border-warning border-opacity-50">
              <span className="badge bg-danger">4K ULTRA HD</span>
              <span className="text-warning small fw-semibold">Plataforma Oficial de Entretenimiento</span>
            </div>
            <h1 className="hero-title mb-3">
              Tu Puerta al <span className="hero-title-highlight">Cine y Series</span> de Calidad
            </h1>
            <p className="lead text-muted mb-4" style={{ maxWidth: '620px' }}>
              Administra y publica producciones cinematográficas con enlaces directos, control de directores, casas productoras y géneros activos.
            </p>
            <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
              <button className="btn btn-primary-custom d-flex align-items-center gap-2" onClick={() => handleOpenModal()}>
                <i className="bi bi-plus-circle-fill fs-5"></i> Publicar Película / Serie
              </button>
              <a href="#catalogo" className="btn btn-gold-custom d-flex align-items-center gap-2">
                <i className="bi bi-compass-fill fs-5"></i> Explorar Catálogo
              </a>
            </div>
          </div>
          <div className="col-lg-4 mt-4 mt-lg-0 text-center">
            <div className="p-4 rounded-4 bg-dark bg-opacity-75 border border-warning border-opacity-25 shadow-lg">
              <div className="display-4 text-warning mb-2">⭐ ⭐ ⭐ ⭐ ⭐</div>
              <h5 className="fw-bold text-white mb-1">Catálogo Verificado</h5>
              <p className="text-muted small mb-0">Contenido administrado con integridad relacional</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjetas de Métricas Rápidas (Stats Counters) */}
      <div className="row g-3 mb-5">
        <div className="col-6 col-md-3">
          <div className="stat-card d-flex align-items-center gap-3">
            <div className="stat-icon stat-icon-red">
              <i className="bi bi-film"></i>
            </div>
            <div>
              <div className="fs-4 fw-bold text-white">{mediaList.length}</div>
              <div className="small text-muted">Producciones</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="stat-card d-flex align-items-center gap-3">
            <div className="stat-icon stat-icon-gold">
              <i className="bi bi-tags-fill"></i>
            </div>
            <div>
              <div className="fs-4 fw-bold text-warning">{activeGenres.length}</div>
              <div className="small text-muted">Géneros Activos</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="stat-card d-flex align-items-center gap-3">
            <div className="stat-icon stat-icon-gold">
              <i className="bi bi-person-video"></i>
            </div>
            <div>
              <div className="fs-4 fw-bold text-warning">{activeDirectors.length}</div>
              <div className="small text-muted">Directores Activos</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="stat-card d-flex align-items-center gap-3">
            <div className="stat-icon stat-icon-red">
              <i className="bi bi-buildings-fill"></i>
            </div>
            <div>
              <div className="fs-4 fw-bold text-white">{activeProducers.length}</div>
              <div className="small text-muted">Productoras Activas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección del Catálogo con Buscador y Filtros */}
      <div id="catalogo" className="pt-2 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h3 className="fw-bold mb-1 text-white">
              <i className="bi bi-collection-play-fill text-danger me-2"></i>Catálogo Multimedia
            </h3>
            <p className="text-muted mb-0">Explora o busca tus títulos favoritos</p>
          </div>
          <div className="d-flex gap-2">
            <button
              className={`btn btn-sm ${filterType === 'all' ? 'btn-danger' : 'btn-outline-secondary'}`}
              onClick={() => setFilterType('all')}
            >
              Todos ({mediaList.length})
            </button>
            {types.map((t) => (
              <button
                key={t._id}
                className={`btn btn-sm ${filterType === t._id ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary'}`}
                onClick={() => setFilterType(t._id)}
              >
                {t.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* Barra de Búsqueda */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="input-group input-group-lg">
              <span className="input-group-text bg-dark border-warning border-opacity-25 text-warning">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por título, género o director..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="btn btn-dark border-warning border-opacity-25" onClick={() => setSearchTerm('')}>
                  <i className="bi bi-x-lg text-muted"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Listado Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status" style={{ width: '3rem', height: '3rem' }}></div>
            <p className="mt-3 text-warning fw-semibold">Cargando catálogo audiovisual...</p>
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="card table-custom p-5 text-center">
            <i className="bi bi-film fs-1 text-warning mb-3"></i>
            <h4 className="text-white">No se encontraron producciones</h4>
            <p className="text-muted mb-4">
              {searchTerm ? 'No hay resultados para el término buscado.' : 'Aún no has registrado ninguna película o serie en la plataforma.'}
            </p>
            <button className="btn btn-primary-custom btn-sm mx-auto" onClick={() => handleOpenModal()}>
              <i className="bi bi-plus-lg me-1"></i> Agregar Primera Película
            </button>
          </div>
        ) : (
          <div className="row">
            {filteredMedia.map((m) => (
              <MediaCard key={m._id} media={m} onEdit={handleOpenModal} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {/* Cajas de Características (Estilo BiblioTech) */}
      <div className="row g-4 my-5 pt-3 border-top border-secondary border-opacity-25">
        <div className="col-md-4">
          <div className="feature-box text-center text-md-start">
            <div className="stat-icon stat-icon-red mb-3">
              <i className="bi bi-lightning-charge-fill"></i>
            </div>
            <h5 className="fw-bold text-white mb-2">Búsqueda Inteligente</h5>
            <p className="text-muted small mb-0">
              Localiza tus películas y series al instante por título, género o director principal con filtrado dinámico.
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="feature-box text-center text-md-start">
            <div className="stat-icon stat-icon-gold mb-3">
              <i className="bi bi-shield-check"></i>
            </div>
            <h5 className="fw-bold text-white mb-2">Integridad Relacional</h5>
            <p className="text-muted small mb-0">
              Garantiza que toda producción audiovisual esté respaldada por directores, géneros y productoras activas.
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="feature-box text-center text-md-start">
            <div className="stat-icon stat-icon-red mb-3">
              <i className="bi bi-cloud-check-fill"></i>
            </div>
            <h5 className="fw-bold text-white mb-2">Disponibilidad 24/7</h5>
            <p className="text-muted small mb-0">
              Plataforma Cloud diseñada para operar de forma ininterrumpida desde cualquier dispositivo y navegador.
            </p>
          </div>
        </div>
      </div>

      {/* Modal Crear / Editar Media */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-dark">
                <div className="d-flex align-items-center gap-2">
                  <span className="fs-4 text-warning">🎬</span>
                  <h5 className="modal-title fw-bold text-white mb-0">
                    {isEditing ? 'Editar Producción Audiovisual' : 'Publicar Nueva Película o Serie'}
                  </h5>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-warning small fw-bold">Serial Único *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="serial"
                      value={formData.serial}
                      onChange={handleInputChange}
                      placeholder="Ej: MOV-001, SER-2026..."
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-warning small fw-bold">Título de la Producción *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="titulo"
                      value={formData.titulo}
                      onChange={handleInputChange}
                      placeholder="Ej: Inception, Interstellar..."
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label text-warning small fw-bold">Sinopsis Argumental</label>
                    <textarea
                      className="form-control"
                      name="sinopsis"
                      rows="3"
                      value={formData.sinopsis}
                      onChange={handleInputChange}
                      placeholder="Resumen o sinopsis argumental de la producción..."
                    ></textarea>
                  </div>

                  <div className="col-md-8">
                    <label className="form-label text-warning small fw-bold">URL de Reproducción / Video *</label>
                    <input
                      type="url"
                      className="form-control"
                      name="url"
                      value={formData.url}
                      onChange={handleInputChange}
                      placeholder="https://cuevana3.nu/watch/pelicula..."
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label text-warning small fw-bold">Año de Estreno *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="anioEstreno"
                      min="1900"
                      max="2099"
                      value={formData.anioEstreno}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label text-warning small fw-bold">URL de Portada o Póster</label>
                    <input
                      type="url"
                      className="form-control"
                      name="imagenPortada"
                      value={formData.imagenPortada}
                      onChange={handleInputChange}
                      placeholder="https://images.unsplash.com/photo-..."
                    />
                  </div>

                  {/* SELECTS DE RELACIONES FILTRADOS POR ESTADO ACTIVO */}
                  <div className="col-md-6">
                    <label className="form-label text-warning small fw-bold d-flex justify-content-between">
                      <span>Género Principal *</span>
                      <span className="badge bg-success-subtle text-success">Solo Activos</span>
                    </label>
                    <select
                      className="form-select"
                      name="generoPrincipal"
                      value={formData.generoPrincipal}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecciona un género...</option>
                      {activeGenres.map((g) => (
                        <option key={g._id} value={g._id}>
                          {g.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-warning small fw-bold d-flex justify-content-between">
                      <span>Director Principal *</span>
                      <span className="badge bg-success-subtle text-success">Solo Activos</span>
                    </label>
                    <select
                      className="form-select"
                      name="directorPrincipal"
                      value={formData.directorPrincipal}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecciona un director...</option>
                      {activeDirectors.map((d) => (
                        <option key={d._id} value={d._id}>
                          {d.nombres}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-warning small fw-bold d-flex justify-content-between">
                      <span>Casa Productora *</span>
                      <span className="badge bg-success-subtle text-success">Solo Activas</span>
                    </label>
                    <select
                      className="form-select"
                      name="productora"
                      value={formData.productora}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecciona una productora...</option>
                      {activeProducers.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-warning small fw-bold">Tipo de Multimedia *</label>
                    <select
                      className="form-select"
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecciona el tipo...</option>
                      {types.map((t) => (
                        <option key={t._id} value={t._id}>
                          {t.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="modal-footer bg-dark">
                  <button type="button" className="btn btn-outline-secondary" onClick={handleCloseModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary-custom">
                    {isEditing ? 'Actualizar Producción' : 'Publicar en Catálogo'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaView;
