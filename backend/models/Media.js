const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
    serial: {
        type: String,
        required: [true, 'El serial es obligatorio'],
        unique: true,
        trim: true
    },
    titulo: {
        type: String,
        required: [true, 'El título es obligatorio'],
        trim: true
    },
    sinopsis: {
        type: String,
        trim: true
    },
    url: {
        type: String,
        required: [true, 'La URL de la película es obligatoria'],
        unique: true,
        trim: true
    },
    imagenPortada: {
        type: String,
        trim: true
    },
    anioEstreno: {
        type: Number,
        required: [true, 'El año de estreno es obligatorio']
    },
    generoPrincipal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre',
        required: [true, 'El género principal es obligatorio']
    },
    directorPrincipal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Director',
        required: [true, 'El director principal es obligatorio']
    },
    productora: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producer',
        required: [true, 'La productora es obligatoria']
    },
    tipo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Type',
        required: [true, 'El tipo es obligatorio']
    }
}, {
    timestamps: {
        createdAt: 'fechaCreacion',
        updatedAt: 'fechaActualizacion'
    }
});

if (process.env.USE_MOCK_DB === 'true') {
    const MockModel = require('./MockModel');
    module.exports = new MockModel('Media');
} else {
    module.exports = mongoose.model('Media', MediaSchema);
}
