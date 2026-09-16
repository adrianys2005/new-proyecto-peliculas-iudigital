import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { getProducers, createProducer, updateProducer, deleteProducer } from '../services/producerService';

const ProducerView = () => {
  const [producers, setProducers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    estado: 'Activo',
    slogan: '',
    descripcion: ''
  });

  const loadProducers = async () => {
    try {
      setLoading(true);
      const data = await getProducers();
      setProducers(data);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar las productoras.',
        background: '#15161e',
        color: '#fff',
        confirmButtonColor: '#e50914'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducers();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleOpenModal = (producer = null) => {
    if (producer) {
      setIsEditing(true);
      setCurrentId(producer._id);
      setFormData({
        nombre: producer.nombre || '',
        estado: producer.estado || 'Activo',
        slogan: producer.slogan || '',
        descripcion: producer.descripcion || ''
      });
    } else {
      setIsEditing(false);
      setCurrentId(null);
      setFormData({
        nombre: '',
        estado: 'Activo',
        slogan: '',
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
        text: 'El nombre de la productora es obligatorio.',
        background: '#15161e',
        color: '#fff',
        confirmButtonColor: '#f59e0b'
      });
      return;
    }

    try {
      if (isEditing) {
        await updateProducer(currentId, formData);
        Swal.fire({
          icon: 'success',
          title: '¡Actualizado!',
          text: 'Productora modificada exitosamente.',
          background: '#15161e',
          color: '#fff',
          confirmButtonColor: '#e50914'
        });
      } else {
        await createProducer(formData);
        Swal.fire({
          icon: 'success',
          title: '¡Creada!',
          text: 'Productora registrada exitosamente.',
          background: '#15161e',
          color: '#fff',
          confirmButtonColor: '#e50914'
        });
      }
      handleCloseModal();
      loadProducers();
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
      text: `Se eliminará la productora "${nombre}"`,
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
          await deleteProducer(id);
          Swal.fire({
            icon: 'success',
            title: '¡Eliminada!',
            text: 'La productora ha sido eliminada.',
            background: '#15161e',
            color: '#fff',
            confirmButtonColor: '#e50914'
          });
          loadProducers();
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar la productora.',
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
            <span className="fs-3 text-warning">🏢</span>
            <h2 className="fw-bold text-white mb-0">Módulo de Productoras</h2>
          </div>
          <p className="text-muted mb-0">Gestiona las casas productoras cinematográficas (Disney, Warner, MGM, etc.).</p>
        </div>
        <button className="btn btn-primary-custom d-flex align-items-center gap-2" onClick={() => handleOpenModal()}>
          <i className="bi bi-plus-circle-fill"></i> Nueva Productora
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status"></div>
          <p className="mt-2 text-warning">Cargando productoras...</p>
        </div>
      ) : producers.length === 0 ? (
        <div className="card table-custom p-5 text-center">
          <i className="bi bi-building-x fs-1 text-warning mb-2"></i>
          <h5 className="text-white">No hay productoras registradas</h5>
          <p className="text-muted">Crea una productora para asociarla a tus películas y series.</p>
        </div>
      ) : (
        <div className="table-responsive table-custom">
          <table className="table table-dark table-hover mb-0">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Slogan</th>
                <th>Descripción</th>
                <th>Fecha Creación</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {producers.map((p) => (
                <tr key={p._id}>
                  <td className="fw-bold text-white">
                    <i className="bi bi-buildings text-danger me-2"></i>
                    {p.nombre}
                  </td>
                  <td>
                    <span className={`badge ${p.estado === 'Activo' ? 'bg-success' : 'bg-secondary'}`}>
                      {p.estado}
                    </span>
                  </td>
                  <td className="text-warning small fst-italic">{p.slogan || '—'}</td>
                  <td className="text-muted small">{p.descripcion || 'Sin descripción'}</td>
                  <td className="text-muted small">
                    {p.fechaCreacion ? new Date(p.fechaCreacion).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="text-end">
                    <button className="btn btn-sm btn-outline-gold me-2" onClick={() => handleOpenModal(p)} title="Editar">
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p._id, p.nombre)} title="Eliminar">
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
                  {isEditing ? 'Editar Productora' : 'Crear Nueva Productora'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label text-warning small fw-bold">Nombre de la Productora *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      placeholder="Ej: Warner Bros, Paramount, Universal..."
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
                    <label className="form-label text-warning small fw-bold">Slogan</label>
                    <input
                      type="text"
                      className="form-control"
                      name="slogan"
                      value={formData.slogan}
                      onChange={handleInputChange}
                      placeholder="Ej: The Stuff That Dreams Are Made Of"
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
                      placeholder="Breve descripción de la compañía..."
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

export default ProducerView;
