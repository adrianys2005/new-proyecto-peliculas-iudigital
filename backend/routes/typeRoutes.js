const express = require('express');
const router = express.Router();
const Type = require('../models/Type');

// @route   GET /api/types
// @desc    Obtener todos los tipos
router.get('/', async (req, res) => {
    try {
        const types = await Type.find().sort({ fechaCreacion: -1 });
        res.json(types);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// @route   GET /api/types/:id
// @desc    Obtener un tipo por ID
router.get('/:id', async (req, res) => {
    try {
        const type = await Type.findById(req.params.id);
        if (!type) {
            return res.status(404).json({ msg: 'Tipo no encontrado' });
        }
        res.json(type);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Tipo no encontrado' });
        }
        res.status(500).send('Error del servidor');
    }
});

// @route   POST /api/types
// @desc    Crear un tipo
router.post('/', async (req, res) => {
    const { nombre, descripcion } = req.body;

    if (!nombre) {
        return res.status(400).json({ msg: 'El nombre es obligatorio' });
    }

    try {
        let typeExists = await Type.findOne({ nombre });
        if (typeExists) {
            return res.status(400).json({ msg: 'Ya existe un tipo con ese nombre' });
        }

        const newType = new Type({
            nombre,
            descripcion
        });

        const type = await newType.save();
        res.status(201).json(type);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// @route   PUT /api/types/:id
// @desc    Actualizar un tipo
router.put('/:id', async (req, res) => {
    const { nombre, descripcion } = req.body;

    try {
        let type = await Type.findById(req.params.id);
        if (!type) {
            return res.status(404).json({ msg: 'Tipo no encontrado' });
        }

        if (nombre && nombre !== type.nombre) {
            let typeExists = await Type.findOne({ nombre });
            if (typeExists) {
                return res.status(400).json({ msg: 'Ya existe otro tipo con ese nombre' });
            }
            type.nombre = nombre;
        }

        if (descripcion !== undefined) type.descripcion = descripcion;

        await type.save();
        res.json(type);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Tipo no encontrado' });
        }
        res.status(500).send('Error del servidor');
    }
});

// @route   DELETE /api/types/:id
// @desc    Eliminar un tipo
router.delete('/:id', async (req, res) => {
    try {
        const type = await Type.findById(req.params.id);
        if (!type) {
            return res.status(404).json({ msg: 'Tipo no encontrado' });
        }

        await Type.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Tipo eliminado correctamente' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Tipo no encontrado' });
        }
        res.status(500).send('Error del servidor');
    }
});

module.exports = router;
