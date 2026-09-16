const mongoose = require('mongoose');

const DirectorSchema = new mongoose.Schema({
    nombres: {
        type: String,
        required: [true, 'El nombre del director es obligatorio'],
        trim: true
    },
    estado: {
        type: String,
        enum: ['Activo', 'Inactivo'],
        default: 'Activo'
    }
}, {
    timestamps: {
        createdAt: 'fechaCreacion',
        updatedAt: 'fechaActualizacion'
    }
});

if (process.env.USE_MOCK_DB === 'true') {
    const MockModel = require('./MockModel');
    module.exports = new MockModel('Director', { estado: 'Activo' });
} else {
    module.exports = mongoose.model('Director', DirectorSchema);
}
