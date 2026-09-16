const mongoose = require('mongoose');

const GenreSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del género es obligatorio'],
        unique: true,
        trim: true
    },
    estado: {
        type: String,
        enum: ['Activo', 'Inactivo'],
        default: 'Activo'
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
    module.exports = new MockModel('Genre', { estado: 'Activo' });
} else {
    module.exports = mongoose.model('Genre', GenreSchema);
}
