const express = require('express');
const router = express.Router();
const Media = require('../models/Media');
const Genre = require('../models/Genre');
const Director = require('../models/Director');
const Producer = require('../models/Producer');
const Type = require('../models/Type');

// Función de validación de relaciones y estado Activo
async function validateRelations(body, isUpdate = false) {
    const { generoPrincipal, directorPrincipal, productora, tipo } = body;

    // Validación de Género
    if (!isUpdate || generoPrincipal !== undefined) {
        if (!generoPrincipal) return { status: 400, msg: 'El género principal es obligatorio' };
        try {
            const genre = await Genre.findById(generoPrincipal);
            if (!genre) return { status: 404, msg: 'El género principal especificado no existe' };
            if (genre.estado !== 'Activo') return { status: 400, msg: 'El género principal seleccionado debe estar Activo' };
        } catch (e) {
            return { status: 400, msg: 'ID de género principal inválido' };
        }
    }

    // Validación de Director
    if (!isUpdate || directorPrincipal !== undefined) {
        if (!directorPrincipal) return { status: 400, msg: 'El director principal es obligatorio' };
        try {
            const director = await Director.findById(directorPrincipal);
            if (!director) return { status: 404, msg: 'El director principal especificado no existe' };
            if (director.estado !== 'Activo') return { status: 400, msg: 'El director principal seleccionado debe estar Activo' };
        } catch (e) {
            return { status: 400, msg: 'ID de director principal inválido' };
        }
    }

    // Validación de Productora
    if (!isUpdate || productora !== undefined) {
        if (!productora) return { status: 400, msg: 'La productora es obligatoria' };
        try {
            const producer = await Producer.findById(productora);
            if (!producer) return { status: 404, msg: 'La productora especificada no existe' };
            if (producer.estado !== 'Activo') return { status: 400, msg: 'La productora seleccionada debe estar Activa' };
        } catch (e) {
            return { status: 400, msg: 'ID de productora inválido' };
        }
    }

    // Validación de Tipo
    if (!isUpdate || tipo !== undefined) {
        if (!tipo) return { status: 400, msg: 'El tipo es obligatorio' };
        try {
            const type = await Type.findById(tipo);
            if (!type) return { status: 404, msg: 'El tipo especificado no existe' };
        } catch (e) {
            return { status: 400, msg: 'ID de tipo inválido' };
        }
    }

    return null; // Todo correcto
}

// @route   GET /api/media
// @desc    Obtener todas las producciones (películas y series) con sus relaciones pobladas
router.get('/', async (req, res) => {
    try {
        const mediaList = await Media.find()
            .populate('generoPrincipal')
            .populate('directorPrincipal')
            .populate('productora')
            .populate('tipo')
            .sort({ fechaCreacion: -1 });
        res.json(mediaList);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// @route   GET /api/media/:id
// @desc    Obtener una producción por ID
router.get('/:id', async (req, res) => {
    try {
        const media = await Media.findById(req.params.id)
            .populate('generoPrincipal')
            .populate('directorPrincipal')
            .populate('productora')
            .populate('tipo');
        if (!media) {
            return res.status(404).json({ msg: 'Producción no encontrada' });
        }
        res.json(media);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Producción no encontrada' });
        }
        res.status(500).send('Error del servidor');
    }
});

// @route   POST /api/media
// @desc    Crear una producción
router.post('/', async (req, res) => {
    const { serial, titulo, sinopsis, url, imagenPortada, anioEstreno, generoPrincipal, directorPrincipal, productora, tipo } = req.body;

    // Validaciones de campos obligatorios básicos
    if (!serial || !titulo || !url || !anioEstreno) {
        return res.status(400).json({ msg: 'Serial, título, URL y año de estreno son obligatorios' });
    }

    try {
        // Validar serial único
        let serialExists = await Media.findOne({ serial });
        if (serialExists) {
            return res.status(400).json({ msg: 'Ya existe una producción con este serial' });
        }

        // Validar url única
        let urlExists = await Media.findOne({ url });
        if (urlExists) {
            return res.status(400).json({ msg: 'Ya existe una producción con esta URL' });
        }

        // Validar relaciones de llaves foráneas y sus estados activos
        const validationError = await validateRelations(req.body, false);
        if (validationError) {
            return res.status(validationError.status).json({ msg: validationError.msg });
        }

        const newMedia = new Media({
            serial,
            titulo,
            sinopsis,
            url,
            imagenPortada,
            anioEstreno,
            generoPrincipal,
            directorPrincipal,
            productora,
            tipo
        });

        const media = await newMedia.save();
        
        // Retornar el elemento creado poblado
        const populatedMedia = await Media.findById(media._id)
            .populate('generoPrincipal')
            .populate('directorPrincipal')
            .populate('productora')
            .populate('tipo');

        res.status(201).json(populatedMedia);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// @route   PUT /api/media/:id
// @desc    Actualizar una producción
router.put('/:id', async (req, res) => {
    const { serial, titulo, sinopsis, url, imagenPortada, anioEstreno, generoPrincipal, directorPrincipal, productora, tipo } = req.body;

    try {
        let media = await Media.findById(req.params.id);
        if (!media) {
            return res.status(404).json({ msg: 'Producción no encontrada' });
        }

        // Si cambia el serial, validar que sea único
        if (serial && serial !== media.serial) {
            let serialExists = await Media.findOne({ serial });
            if (serialExists) {
                return res.status(400).json({ msg: 'Ya existe otra producción con este serial' });
            }
            media.serial = serial;
        }

        // Si cambia la URL, validar que sea única
        if (url && url !== media.url) {
            let urlExists = await Media.findOne({ url });
            if (urlExists) {
                return res.status(400).json({ msg: 'Ya existe otra producción con esta URL' });
            }
            media.url = url;
        }

        // Validar relaciones que se estén intentando actualizar y que estén activas
        const validationError = await validateRelations(req.body, true);
        if (validationError) {
            return res.status(validationError.status).json({ msg: validationError.msg });
        }

        if (titulo !== undefined) media.titulo = titulo;
        if (sinopsis !== undefined) media.sinopsis = sinopsis;
        if (imagenPortada !== undefined) media.imagenPortada = imagenPortada;
        if (anioEstreno !== undefined) media.anioEstreno = anioEstreno;
        if (generoPrincipal !== undefined) media.generoPrincipal = generoPrincipal;
        if (directorPrincipal !== undefined) media.directorPrincipal = directorPrincipal;
        if (productora !== undefined) media.productora = productora;
        if (tipo !== undefined) media.tipo = tipo;

        await media.save();

        // Retornar elemento actualizado poblado
        const populatedMedia = await Media.findById(media._id)
            .populate('generoPrincipal')
            .populate('directorPrincipal')
            .populate('productora')
            .populate('tipo');

        res.json(populatedMedia);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Producción no encontrada' });
        }
        res.status(500).send('Error del servidor');
    }
});

// @route   DELETE /api/media/:id
// @desc    Eliminar una producción
router.delete('/:id', async (req, res) => {
    try {
        const media = await Media.findById(req.params.id);
        if (!media) {
            return res.status(404).json({ msg: 'Producción no encontrada' });
        }

        await Media.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Producción eliminada correctamente' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Producción no encontrada' });
        }
        res.status(500).send('Error del servidor');
    }
});

module.exports = router;
