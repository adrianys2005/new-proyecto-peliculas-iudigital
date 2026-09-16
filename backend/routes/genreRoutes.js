const express = require('express');
const router = express.Router();
const Genre = require('../models/Genre');

// @route   GET /api/genres
// @desc    Obtener todos los géneros
router.get('/', async (req, res) => {
    try {
        const genres = await Genre.find().sort({ fechaCreacion: -1 });
        res.json(genres);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// @route   GET /api/genres/:id
// @desc    Obtener un género por ID
router.get('/:id', async (req, res) => {
    try {
        const genre = await Genre.findById(req.params.id);
        if (!genre) {
            return res.status(404).json({ msg: 'Género no encontrado' });
        }
        res.json(genre);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Género no encontrado' });
        }
        res.status(500).send('Error del servidor');
    }
});

// @route   POST /api/genres
// @desc    Crear un género
router.post('/', async (req, res) => {
    const { nombre, estado, descripcion } = req.body;

    if (!nombre) {
        return res.status(400).json({ msg: 'El nombre es obligatorio' });
    }

    try {
        // Verificar si ya existe
        let genreExists = await Genre.findOne({ nombre });
        if (genreExists) {
            return res.status(400).json({ msg: 'Ya existe un género con ese nombre' });
        }

        const newGenre = new Genre({
            nombre,
            estado,
            descripcion
        });

        const genre = await newGenre.save();
        res.status(201).json(genre);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// @route   PUT /api/genres/:id
// @desc    Actualizar un género
router.put('/:id', async (req, res) => {
    const { nombre, estado, descripcion } = req.body;

    try {
        let genre = await Genre.findById(req.params.id);
        if (!genre) {
            return res.status(404).json({ msg: 'Género no encontrado' });
        }

        // Si cambia el nombre, verificar que no esté duplicado
        if (nombre && nombre !== genre.nombre) {
            let genreExists = await Genre.findOne({ nombre });
            if (genreExists) {
                return res.status(400).json({ msg: 'Ya existe otro género con ese nombre' });
            }
            genre.nombre = nombre;
        }

        if (estado !== undefined) genre.estado = estado;
        if (descripcion !== undefined) genre.descripcion = descripcion;

        await genre.save();
        res.json(genre);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Género no encontrado' });
        }
        res.status(500).send('Error del servidor');
    }
});

// @route   DELETE /api/genres/:id
// @desc    Eliminar un género
router.delete('/:id', async (req, res) => {
    try {
        const genre = await Genre.findById(req.params.id);
        if (!genre) {
            return res.status(404).json({ msg: 'Género no encontrado' });
        }

        await Genre.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Género eliminado correctamente' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Género no encontrado' });
        }
        res.status(500).send('Error del servidor');
    }
});

module.exports = router;
