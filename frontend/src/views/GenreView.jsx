import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getGenres, createGenre, updateGenre, deleteGenre } from '../services/genreService';

const GenreView = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    estado: 'Activo',
    descripcion: ''
  });

  const loadGenres = async () => {
    try {
      setLoading(true);
      const data = await getGenres();
      setGenres(data);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los géneros.',
        background: '#15161e',
        color: '#fff',
        confirmButtonColor: '#e50914'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGenres();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleOpenModal = (genre = null) => {
    if (genre) {
      setIsEditing(true);
      setCurrentId(genre._id);
      setFormData({
        nombre: genre.nombre || '',
        estado: genre.estado || 'Activo',
        descripcion: genre.descripcion || ''
      });
    } else {
      setIsEditing(false);
      setCurrentId(null);
      setFormData({
        nombre: '',
        estado: 'Activo',
        descripcion: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'El nombre del género es obligatorio.',
        background: '#15161e',
        color: '#fff',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    try {
      if (isEditing) {
        await updateGenre(currentId, formData);
        Swal.fire({
          icon: 'success',
          title: '¡Actualizado!',
          text: 'Género modificado exitosamente.',
          background: '#15161e',
          color: '#fff',
          confirmButtonColor: '#e50914'
        });
      } else {
        await createGenre(formData);
        Swal.fire({
          icon: 'success',
          title: '¡Creado!',
          text: 'Género registrado exitosamente.',
          background: '#15161e',
          color: '#fff',
          confirmButtonColor: '#e50914'
        });
      }
      handleCloseModal();
      loadGenres();
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.msg || 'Error al procesar la solicitud.';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: msg,
        background: '#15161e',
        color: '#fff',
        confirmButtonColor: '#e50914'
      });
    }
  };

  const handleDelete = (id, nombre) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará el género "${nombre}"`,
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
          await deleteGenre(id);
          Swal.fire({
            icon: 'success',
            title: '¡Eliminado!',
            text: 'El género ha sido eliminado.',
            background: '#15161e',
            color: '#fff',
            confirmButtonColor: '#e50914'
          });
          loadGenres();
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el género.',
            background: '#15161e',
            color: '#fff',
            confirmButtonColor: '#e50914'
          });
        }
      }
    });
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="fs-3 text-warning">🏷️</span>
            <h2 className="fw-bold text-white mb-0">Módulo de Géneros</h2>
          </div>
          <p className="text-muted mb-0">Administra las categorías de películas y series disponibles.</p>
        </div>
        <button className="btn btn-primary-custom d-flex align-items-center gap-2" onClick={() => handleOpenModal()}>
          <i className="bi bi-plus-circle-fill"></i> Nuevo Género
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status"></div>
          <p className="mt-2 text-warning">Cargando géneros...</p>
        </div>
      ) : genres.length === 0 ? (
        <div className="card table-custom p-5 text-center">
          <i className="bi bi-tags fs-1 text-warning mb-2"></i>
          <h5 className="text-white">No hay géneros registrados</h5>
          <p className="text-muted">Crea el primer género o ejecuta el semillero inicial.</p>
        </div>
      ) : (
        <div className="table-responsive table-custom">
          <table className="table table-dark table-hover mb-0">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Descripción</th>
                <th>Fecha Creación</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {genres.map((g) => (
                <tr key={g._id}>
                  <td className="fw-bold text-white">
                    <i className="bi bi-tag-fill text-warning me-2"></i>
                    {g.nombre}
                  </td>
                  <td>
                    <span className={`badge ${g.estado === 'Activo' ? 'bg-success' : 'bg-secondary'}`}>
                      {g.estado}
                    </span>
                  </td>
                  <td className="text-muted small">{g.descripcion || 'Sin descripción'}</td>
                  <td className="text-muted small">
                    {g.fechaCreacion ? new Date(g.fechaCreacion).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-gold me-2" onClick={() => handleOpenModal(g)} title="Editar">
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(g._id, g.nombre)} title="Eliminar">
                      <i className="bi bi-trash3"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-dark">
                <h5 className="modal-title fw-bold text-white">
                  {isEditing ? 'Editar Género' : 'Crear Nuevo Género'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label text-warning small fw-bold">Nombre del Género *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      placeholder="Ej: Acción, Terror, Comedia..."
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-warning small fw-bold">Estado</label>
                    <select
                      className="form-select"
                      name="estado"
                      value={formData.estado}
                      onChange={handleInputChange}
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-warning small fw-bold">Descripción</label>
                    <textarea
                      className="form-control"
                      name="descripcion"
                      rows="3"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      placeholder="Breve descripción del género..."
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer bg-dark">
                  <button type="button" className="btn btn-outline-secondary" onClick={handleCloseModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary-custom">
                    {isEditing ? 'Actualizar' : 'Guardar'}
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

export default GenreView;
