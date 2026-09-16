const express = require('express');
const router = express.Router();
const Director = require('../models/Director');

// @route   GET /api/directors
// @desc    Obtener todos los directores
router.get('/', async (req, res) => {
    try {
        const directors = await Director.find().sort({ fechaCreacion: -1 });
        res.json(directors);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// @route   GET /api/directors/:id
// @desc    Obtener un director por ID
router.get('/:id', async (req, res) => {
    try {
        const director = await Director.findById(req.params.id);
        if (!director) {
            return res.status(404).json({ msg: 'Director no encontrado' });
        }
        res.json(director);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Director no encontrado' });
        }
        res.status(500).send('Error del servidor');
    }
});

// @route   POST /api/directors
// @desc    Crear un director
router.post('/', async (req, res) => {
    const { nombres, estado } = req.body;

    if (!nombres) {
        return res.status(400).json({ msg: 'El nombre del director es obligatorio' });
    }

    try {
        const newDirector = new Director({
            nombres,
            estado
        });

        const director = await newDirector.save();
        res.status(201).json(director);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// @route   PUT /api/directors/:id
// @desc    Actualizar un director
router.put('/:id', async (req, res) => {
    const { nombres, estado } = req.body;

    try {
        let director = await Director.findById(req.params.id);
        if (!director) {
            return res.status(404).json({ msg: 'Director no encontrado' });
        }

        if (nombres !== undefined) director.nombres = nombres;
        if (estado !== undefined) director.estado = estado;

        await director.save();
        res.json(director);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Director no encontrado' });
        }
        res.status(500).send('Error del servidor');
    }
});

// @route   DELETE /api/directors/:id
// @desc    Eliminar un director
router.delete('/:id', async (req, res) => {
    try {
        const director = await Director.findById(req.params.id);
        if (!director) {
            return res.status(404).json({ msg: 'Director no encontrado' });
        }

        await Director.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Director eliminado correctamente' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Director no encontrado' });
        }
        res.status(500).send('Error del servidor');
    }
});

module.exports = router;
