import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getDirectors, createDirector, updateDirector, deleteDirector } from '../services/directorService';

const DirectorView = () => {
  const [directors, setDirectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    nombres: '',
    estado: 'Activo'
  });

  const loadDirectors = async () => {
    try {
      setLoading(true);
      const data = await getDirectors();
      setDirectors(data);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los directores.',
        background: '#15161e',
        color: '#fff',
        confirmButtonColor: '#e50914'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDirectors();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleOpenModal = (director = null) => {
    if (director) {
      setIsEditing(true);
      setCurrentId(director._id);
      setFormData({
        nombres: director.nombres || '',
        estado: director.estado || 'Activo'
      });
    } else {
      setIsEditing(false);
      setCurrentId(null);
      setFormData({
        nombres: '',
        estado: 'Activo'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombres.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'El nombre del director es obligatorio.',
        background: '#15161e',
        color: '#fff',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    try {
      if (isEditing) {
        await updateDirector(currentId, formData);
        Swal.fire({
          icon: 'success',
          title: '¡Actualizado!',
          text: 'Director modificado exitosamente.',
          background: '#15161e',
          color: '#fff',
          confirmButtonColor: '#e50914'
        });
      } else {
        await createDirector(formData);
        Swal.fire({
          icon: 'success',
          title: '¡Creado!',
          text: 'Director registrado exitosamente.',
          background: '#15161e',
          color: '#fff',
          confirmButtonColor: '#e50914'
        });
      }
      handleCloseModal();
      loadDirectors();
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

  const handleDelete = (id, nombres) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará al director "${nombres}"`,
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
          await deleteDirector(id);
          Swal.fire({
            icon: 'success',
            title: '¡Eliminado!',
            text: 'El director ha sido eliminado.',
            background: '#15161e',
            color: '#fff',
            confirmButtonColor: '#e50914'
          });
          loadDirectors();
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el director.',
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
            <span className="fs-3 text-warning">🎥</span>
            <h2 className="fw-bold text-white mb-0">Módulo de Directores</h2>
          </div>
          <p className="text-muted mb-0">Gestiona los directores principales de las producciones.</p>
        </div>
        <button className="btn btn-primary-custom d-flex align-items-center gap-2" onClick={() => handleOpenModal()}>
          <i className="bi bi-plus-circle-fill"></i> Nuevo Director
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status"></div>
          <p className="mt-2 text-warning">Cargando directores...</p>
        </div>
      ) : directors.length === 0 ? (
        <div className="card table-custom p-5 text-center">
          <i className="bi bi-person-x fs-1 text-warning mb-2"></i>
          <h5 className="text-white">No hay directores registrados</h5>
          <p className="text-muted">Agrega un director principal para poder asignarlo a las producciones.</p>
        </div>
      ) : (
        <div className="table-responsive table-custom">
          <table className="table table-dark table-hover mb-0">
            <thead>
              <tr>
                <th>Nombres</th>
                <th>Estado</th>
                <th>Fecha Creación</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {directors.map((d) => (
                <tr key={d._id}>
                  <td className="fw-bold text-white">
                    <i className="bi bi-person-badge text-warning me-2"></i>
                    {d.nombres}
                  </td>
                  <td>
                    <span className={`badge ${d.estado === 'Activo' ? 'bg-success' : 'bg-secondary'}`}>
                      {d.estado}
                    </span>
                  </td>
                  <td className="text-muted small">
                    {d.fechaCreacion ? new Date(d.fechaCreacion).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-gold me-2" onClick={() => handleOpenModal(d)} title="Editar">
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(d._id, d.nombres)} title="Eliminar">
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
                  {isEditing ? 'Editar Director' : 'Crear Nuevo Director'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label text-warning small fw-bold">Nombres y Apellidos *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nombres"
                      value={formData.nombres}
                      onChange={handleInputChange}
                      placeholder="Ej: Christopher Nolan, Guillermo del Toro..."
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

export default DirectorView;
