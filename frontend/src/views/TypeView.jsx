import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getTypes, createType, updateType, deleteType } from '../services/typeService';

const TypeView = () => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });

  const loadTypes = async () => {
    try {
      setLoading(true);
      const data = await getTypes();
      setTypes(data);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los tipos.',
        background: '#15161e',
        color: '#fff',
        confirmButtonColor: '#e50914'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTypes();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleOpenModal = (type = null) => {
    if (type) {
      setIsEditing(true);
      setCurrentId(type._id);
      setFormData({
        nombre: type.nombre || '',
        descripcion: type.descripcion || ''
      });
    } else {
      setIsEditing(false);
      setCurrentId(null);
      setFormData({
        nombre: '',
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
        text: 'El nombre del tipo es obligatorio.',
        background: '#15161e',
        color: '#fff',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    try {
      if (isEditing) {
        await updateType(currentId, formData);
        Swal.fire({
          icon: 'success',
          title: '¡Actualizado!',
          text: 'Tipo modificado exitosamente.',
          background: '#15161e',
          color: '#fff',
          confirmButtonColor: '#e50914'
        });
      } else {
        await createType(formData);
        Swal.fire({
          icon: 'success',
          title: '¡Creado!',
          text: 'Tipo registrado exitosamente.',
          background: '#15161e',
          color: '#fff',
          confirmButtonColor: '#e50914'
        });
      }
      handleCloseModal();
      loadTypes();
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
      text: `Se eliminará el tipo "${nombre}"`,
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
          await deleteType(id);
          Swal.fire({
            icon: 'success',
            title: '¡Eliminado!',
            text: 'El tipo ha sido eliminado.',
            background: '#15161e',
            color: '#fff',
            confirmButtonColor: '#e50914'
          });
          loadTypes();
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el tipo.',
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
            <span className="fs-3 text-warning">🎞️</span>
            <h2 className="fw-bold text-white mb-0">Módulo de Tipos</h2>
          </div>
          <p className="text-muted mb-0">Gestiona las clasificaciones de multimedia (Película, Serie, etc.).</p>
        </div>
        <button className="btn btn-primary-custom d-flex align-items-center gap-2" onClick={() => handleOpenModal()}>
          <i className="bi bi-plus-circle-fill"></i> Nuevo Tipo
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status"></div>
          <p className="mt-2 text-warning">Cargando tipos...</p>
        </div>
      ) : types.length === 0 ? (
        <div className="card table-custom p-5 text-center">
          <i className="bi bi-collection-play fs-1 text-warning mb-2"></i>
          <h5 className="text-white">No hay tipos registrados</h5>
          <p className="text-muted">Crea un tipo de producción para clasificar el catálogo.</p>
        </div>
      ) : (
        <div className="table-responsive table-custom">
          <table className="table table-dark table-hover mb-0">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Fecha Creación</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {types.map((t) => (
                <tr key={t._id}>
                  <td className="fw-bold text-white">
                    <span className="badge bg-danger text-white border border-danger-subtle px-3 py-2">
                      {t.nombre}
                    </span>
                  </td>
                  <td className="text-muted small">{t.descripcion || 'Sin descripción'}</td>
                  <td className="text-muted small">
                    {t.fechaCreacion ? new Date(t.fechaCreacion).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-gold me-2" onClick={() => handleOpenModal(t)} title="Editar">
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(t._id, t.nombre)} title="Eliminar">
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
                  {isEditing ? 'Editar Tipo' : 'Crear Nuevo Tipo'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label text-warning small fw-bold">Nombre del Tipo *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      placeholder="Ej: Película, Serie, Miniserie..."
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-warning small fw-bold">Descripción</label>
                    <textarea
                      className="form-control"
                      name="descripcion"
                      rows="3"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      placeholder="Breve descripción del tipo de contenido..."
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

export default TypeView;
