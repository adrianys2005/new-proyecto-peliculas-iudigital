const express = require('express');
const router = express.Router();
const Producer = require('../models/Producer');

// @route   GET /api/producers
// @desc    Obtener todas las productoras
router.get('/', async (req, res) => {
    try {
        const producers = await Producer.find().sort({ fechaCreacion: -1 });
        res.json(producers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// @route   GET /api/producers/:id
// @desc    Obtener una productora por ID
router.get('/:id', async (req, res) => {
    try {
        const producer = await Producer.findById(req.params.id);
        if (!producer) {
            return res.status(404).json({ msg: 'Productora no encontrada' });
        }
        res.json(producer);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Productora no encontrada' });
        }
        res.status(500).send('Error del servidor');
    }
});

// @route   POST /api/producers
// @desc    Crear una productora
router.post('/', async (req, res) => {
    const { nombre, estado, slogan, descripcion } = req.body;

    if (!nombre) {
        return res.status(400).json({ msg: 'El nombre de la productora es obligatorio' });
    }

    try {
        let producerExists = await Producer.findOne({ nombre });
        if (producerExists) {
            return res.status(400).json({ msg: 'Ya existe una productora con ese nombre' });
        }

        const newProducer = new Producer({
            nombre,
            estado,
            slogan,
            descripcion
        });

        const producer = await newProducer.save();
        res.status(201).json(producer);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// @route   PUT /api/producers/:id
// @desc    Actualizar una productora
router.put('/:id', async (req, res) => {
    const { nombre, estado, slogan, descripcion } = req.body;

    try {
        let producer = await Producer.findById(req.params.id);
        if (!producer) {
            return res.status(404).json({ msg: 'Productora no encontrada' });
        }

        if (nombre && nombre !== producer.nombre) {
            let producerExists = await Producer.findOne({ nombre });
            if (producerExists) {
                return res.status(400).json({ msg: 'Ya existe otra productora con ese nombre' });
            }
            producer.nombre = nombre;
        }

        if (estado !== undefined) producer.estado = estado;
        if (slogan !== undefined) producer.slogan = slogan;
        if (descripcion !== undefined) producer.descripcion = descripcion;

        await producer.save();
        res.json(producer);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Productora no encontrada' });
        }
        res.status(500).send('Error del servidor');
    }
});

// @route   DELETE /api/producers/:id
// @desc    Eliminar una productora
router.delete('/:id', async (req, res) => {
    try {
        const producer = await Producer.findById(req.params.id);
        if (!producer) {
            return res.status(404).json({ msg: 'Productora no encontrada' });
        }

        await Producer.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Productora eliminada correctamente' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Productora no encontrada' });
        }
        res.status(500).send('Error del servidor');
    }
});

module.exports = router;
