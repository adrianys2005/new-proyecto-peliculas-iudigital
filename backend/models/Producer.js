const mongoose = require('mongoose');

const ProducerSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de la productora es obligatorio'],
        unique: true,
        trim: true
    },
    estado: {
        type: String,
        enum: ['Activo', 'Inactivo'],
        default: 'Activo'
    },
    slogan: {
        type: String,
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
    }
}, {
    timestamps: {
        createdAt: 'fechaCreacion',
        updatedAt: 'fechaActualizacion'
    }
});

if (process.env.USE_MOCK_DB === 'true') {
    const MockModel = require('./MockModel');
    module.exports = new MockModel('Producer', { estado: 'Activo' });
} else {
    module.exports = mongoose.model('Producer', ProducerSchema);
}
