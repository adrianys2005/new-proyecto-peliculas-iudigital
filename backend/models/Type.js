const mongoose = require('mongoose');

const TypeSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del tipo es obligatorio'],
        unique: true,
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
    module.exports = new MockModel('Type');
} else {
    module.exports = mongoose.model('Type', TypeSchema);
}
