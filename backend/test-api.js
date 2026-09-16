const runTests = async () => {
    const baseUrl = 'http://localhost:4000/api';
    console.log('=== Iniciando Pruebas de Integración de API ===\n');

    try {
        // 1. Obtener géneros iniciales
        console.log('1. Obteniendo géneros del sembrado...');
        const resGenres = await fetch(`${baseUrl}/genres`);
        const genres = await resGenres.json();
        console.log(`   Géneros iniciales encontrados: ${genres.length}`);
        const accId = genres.find(g => g.nombre === 'Acción')?._id;
        console.log(`   ID de Género "Acción": ${accId}`);

        // 2. Crear Género Inactivo para pruebas
        console.log('\n2. Creando Género Inactivo...');
        const resCreateGenreInactivo = await fetch(`${baseUrl}/genres`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: 'Documental Inactivo',
                estado: 'Inactivo',
                descripcion: 'Género inactivo para pruebas de validación'
            })
        });
        const genreInactivo = await resCreateGenreInactivo.json();
        console.log(`   Género Inactivo creado: ${genreInactivo.nombre} (ID: ${genreInactivo._id})`);

        // 3. Crear Director Activo
        console.log('\n3. Creando Director Activo...');
        const resCreateDirector = await fetch(`${baseUrl}/directors`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombres: 'Steven Spielberg',
                estado: 'Activo'
            })
        });
        const directorActivo = await resCreateDirector.json();
        console.log(`   Director creado: ${directorActivo.nombres} (ID: ${directorActivo._id})`);

        // 4. Crear Productora Activa
        console.log('\n4. Creando Productora Activa...');
        const resCreateProducer = await fetch(`${baseUrl}/producers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: 'DreamWorks',
                estado: 'Activo',
                slogan: 'Interactive Entertainment',
                descripcion: 'Estudio de cine y animación estadounidense'
            })
        });
        const producerActiva = await resCreateProducer.json();
        console.log(`   Productora creada: ${producerActiva.nombre} (ID: ${producerActiva._id})`);

        // 5. Obtener Tipo (Película) del sembrado
        console.log('\n5. Obteniendo Tipo "Película" del sembrado...');
        const resTypes = await fetch(`${baseUrl}/types`);
        const types = await resTypes.json();
        const tipoPeliculaId = types.find(t => t.nombre === 'Película')?._id;
        console.log(`   ID de Tipo "Película": ${tipoPeliculaId}`);

        // 6. Crear Media - ÉXITO (Todas las relaciones activas)
        console.log('\n6. Creando Media con relaciones Activas (Debe funcionar)...');
        const resCreateMediaSuccess = await fetch(`${baseUrl}/media`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                serial: 'M-101',
                titulo: 'Jurassic Park',
                sinopsis: 'Un parque temático de dinosaurios clonados sufre un colapso de seguridad...',
                url: 'https://play.iudmovies.edu.co/watch/jurassic-park',
                imagenPortada: 'https://play.iudmovies.edu.co/covers/jurassic-park.jpg',
                anioEstreno: 1993,
                generoPrincipal: accId, // Acción (Activo)
                directorPrincipal: directorActivo._id, // Steven Spielberg (Activo)
                productora: producerActiva._id, // DreamWorks (Activa)
                tipo: tipoPeliculaId // Película
            })
        });
        const mediaSuccess = await resCreateMediaSuccess.json();
        if (resCreateMediaSuccess.ok) {
            console.log(`   ¡ÉXITO! Media registrada: ${mediaSuccess.titulo} (ID: ${mediaSuccess._id})`);
        } else {
            console.error('   ERROR INESPERADO:', mediaSuccess);
        }

        // 7. Crear Media - FALLA (Con Género Inactivo)
        console.log('\n7. Creando Media con relación Inactiva (Debe fallar con error 400)...');
        const resCreateMediaFail = await fetch(`${baseUrl}/media`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                serial: 'M-102',
                titulo: 'Documental sobre la Naturaleza',
                sinopsis: 'Un documental descriptivo sobre la fauna salvaje.',
                url: 'https://play.iudmovies.edu.co/watch/nature-doc',
                imagenPortada: '',
                anioEstreno: 2026,
                generoPrincipal: genreInactivo._id, // Documental Inactivo (Inactivo!)
                directorPrincipal: directorActivo._id,
                productora: producerActiva._id,
                tipo: tipoPeliculaId
            })
        });
        const mediaFail = await resCreateMediaFail.json();
        console.log(`   Respuesta del servidor (Status: ${resCreateMediaFail.status}):`);
        console.log('   ', JSON.stringify(mediaFail));

        if (resCreateMediaFail.status === 400) {
            console.log('\n   ¡Prueba de validación SUPERADA! El servidor rechazó correctamente la media inactiva.');
        } else {
            console.error('\n   ERROR: El servidor debió retornar status 400.');
        }

        // 8. Listar todo el catálogo multimedia
        console.log('\n8. Obteniendo catálogo multimedia completo con relaciones pobladas...');
        const resCatalog = await fetch(`${baseUrl}/media`);
        const catalog = await resCatalog.json();
        console.log(`   Elementos en catálogo: ${catalog.length}`);
        if (catalog.length > 0) {
            console.log('   Primer elemento del catálogo:');
            console.log(`   - Título: ${catalog[0].titulo}`);
            console.log(`   - Género (Poblado): ${catalog[0].generoPrincipal?.nombre}`);
            console.log(`   - Director (Poblado): ${catalog[0].directorPrincipal?.nombres}`);
            console.log(`   - Productora (Poblada): ${catalog[0].productora?.nombre}`);
            console.log(`   - Tipo (Poblado): ${catalog[0].tipo?.nombre}`);
        }

        console.log('\n=== Todas las Pruebas Finalizaron Exitosamente ===');
    } catch (e) {
        console.error('Error durante la ejecución del test:', e.message);
    }
};

runTests();
