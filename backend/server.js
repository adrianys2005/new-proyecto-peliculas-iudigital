require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = async () => {
    if (process.env.USE_MOCK_DB === 'true') {
        console.log('Modo Offline: Utilizando Base de Datos Mock local en archivos JSON.');
        return;
    }
    // Importación dinámica/diferida para evitar que falle el inicio del servidor si Mongoose tarda en cargar.
    const connect = require('./config/db');
    await connect();
};

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta base/home de prueba
app.get('/', (req, res) => {
    res.json({
        name: 'API REST IUDigital Películas y Series',
        version: '1.0.0',
        status: 'Online',
        endpoints: [
            '/api/genres',
            '/api/directors',
            '/api/producers',
            '/api/types',
            '/api/media'
        ]
    });
});

// Registrar rutas
app.use('/api/genres', require('./routes/genreRoutes'));
app.use('/api/directors', require('./routes/directorRoutes'));
app.use('/api/producers', require('./routes/producerRoutes'));
app.use('/api/types', require('./routes/typeRoutes'));
app.use('/api/media', require('./routes/mediaRoutes'));

// Conectar a la base de datos e iniciar servidor
const PORT = process.env.PORT || 4000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Servidor escuchando en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error.message);
        process.exit(1);
    }
};

startServer();
