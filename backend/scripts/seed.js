require('dotenv').config();
const mongoose = require('mongoose');
const Genre = require('../models/Genre');
const Type = require('../models/Type');

const genres = [
    { nombre: 'Acción', estado: 'Activo', descripcion: 'Películas de acción y aventuras emocionantes.' },
    { nombre: 'Aventura', estado: 'Activo', descripcion: 'Viajes, exploraciones y aventuras en lugares exóticos.' },
    { nombre: 'Ciencia Ficción', estado: 'Activo', descripcion: 'Viajes espaciales, tecnología del futuro y mundos paralelos.' },
    { nombre: 'Drama', estado: 'Activo', descripcion: 'Historias serias centradas en el desarrollo de personajes y conflictos emocionales.' },
    { nombre: 'Terror', estado: 'Activo', descripcion: 'Películas diseñadas para provocar suspenso, miedo o pavor.' }
];

const types = [
    { nombre: 'Película', descripcion: 'Producción audiovisual unitaria' },
    { nombre: 'Serie', descripcion: 'Producción audiovisual dividida en episodios o temporadas' }
];

const seedDB = async () => {
    try {
        console.log('Conectando a la base de datos para sembrado...');
        if (process.env.USE_MOCK_DB !== 'true') {
            await mongoose.connect(process.env.MONGO_URI);
            console.log('Base de datos conectada.');
        } else {
            console.log('Modo Offline: Usando base de datos mock local.');
        }

        // Limpiar géneros existentes
        console.log('Limpiando colección de géneros...');
        await Genre.deleteMany({});
        console.log('Insertando géneros iniciales...');
        await Genre.insertMany(genres);
        console.log('Géneros insertados correctamente.');

        // Limpiar tipos existentes
        console.log('Limpiando colección de tipos...');
        await Type.deleteMany({});
        console.log('Insertando tipos iniciales...');
        await Type.insertMany(types);
        console.log('Tipos insertados correctamente.');

        console.log('¡Sembrado completado con éxito!');
        process.exit(0);
    } catch (error) {
        console.error('Error durante el sembrado de datos:', error);
        process.exit(1);
    }
};

seedDB();
