# Evidencia de Aprendizaje: API REST - NodeJs
## Ingeniería Web II - Institución Universitaria Digital de Antioquia (IUDigital)

Este proyecto consiste en el diseño y desarrollo de una **API REST** para el Backend de una aplicación web monolítica ("tipo Cuevana") de administración y publicación de películas y series para la IUDigital de Antioquia. 

Desarrollada con **Node.js**, **Express** y **MongoDB (Mongoose)**, la API permite realizar operaciones CRUD completas sobre 5 módulos interrelacionados, aplicando reglas de validación de negocio estrictas sobre el estado de las entidades referenciadas.

---

## 1. Diseño de la Base de Datos

El diseño de la base de datos se modela mediante colecciones de MongoDB y referencias (Foreign Keys) representadas mediante `ObjectId` de Mongoose.

```
       ┌───────────┐         ┌────────────┐
       │  GENERO   │         │  DIRECTOR  │
       └─────┬─────┘         └─────┬──────┘
             │ 1                   │ 1
             │                     │
             │       ┌───────┐     │
             └──────>│ MEDIA │<────┘
                     └───────┘
             ┌──────>│ (Cine)│<────┐
             │       └───────┘     │
             │                     │
             │ 1                   │ 1
       ┌─────┴─────┐         ┌─────┴──────┐
       │PRODUCTORA │         │    TIPO    │
       └───────────┘         └────────────┘
```

### Esquema y Relaciones de las Colecciones:

1.  **Género (`Genre`)**:
    *   `nombre`: String (Requerido, Único, ej: Acción, Drama).
    *   `estado`: String (Enum: 'Activo' | 'Inactivo', por defecto 'Activo').
    *   `descripcion`: String.
    *   `fechaCreacion` / `fechaActualizacion`: Fechas de control automático.
2.  **Director (`Director`)**:
    *   `nombres`: String (Requerido, ej: Christopher Nolan).
    *   `estado`: String (Enum: 'Activo' | 'Inactivo', por defecto 'Activo').
    *   `fechaCreacion` / `fechaActualizacion`: Fechas de control automático.
3.  **Productora (`Producer`)**:
    *   `nombre`: String (Requerido, Único, ej: Warner Bros).
    *   `estado`: String (Enum: 'Activo' | 'Inactivo', por defecto 'Activo').
    *   `slogan`: String.
    *   `descripcion`: String.
    *   `fechaCreacion` / `fechaActualizacion`: Fechas de control automático.
4.  **Tipo (`Type`)**:
    *   `nombre`: String (Requerido, Único, ej: Película, Serie).
    *   `descripcion`: String.
    *   `fechaCreacion` / `fechaActualizacion`: Fechas de control automático.
5.  **Media (`Media` - Películas y Series)**:
    *   `serial`: String (Requerido, Único).
    *   `titulo`: String (Requerido).
    *   `sinopsis`: String.
    *   `url`: String (Requerido, Única).
    *   `imagenPortada`: String (URL de la imagen).
    *   `anioEstreno`: Number (Requerido).
    *   `generoPrincipal`: ObjectId (Ref a `Genre`, obligatorio, **debe estar Activo**).
    *   `directorPrincipal`: ObjectId (Ref a `Director`, obligatorio, **debe estar Activo**).
    *   `productora`: ObjectId (Ref a `Producer`, obligatoria, **debe estar Activa**).
    *   `tipo`: ObjectId (Ref a `Type`, obligatorio).
    *   `fechaCreacion` / `fechaActualizacion`: Fechas de control automático.

---

## 2. Instrucciones de Configuración y Ejecución

### Requisitos Previos:
*   [Node.js](https://nodejs.org/) (versión v16 o superior).
*   Una instancia de **MongoDB** activa (local o un clúster gratuito en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)).

### Paso 1: Instalación de Dependencias
Abre la terminal en la carpeta `backend` e instala los paquetes necesarios:
```bash
npm install
```

*Nota: Si estás detrás de un proxy corporativo o educativo y tienes problemas de verificación de certificados SSL (`UNABLE_TO_VERIFY_LEAF_SIGNATURE`), puedes resolverlo ejecutando:*
```bash
npm config set strict-ssl false
```

### Paso 2: Configuración de Variables de Entorno
Crea o modifica el archivo `.env` en la raíz del proyecto `backend/`:
```env
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/iudigital_movies
```
*Si deseas utilizar MongoDB Atlas, reemplaza la URI local por tu cadena de conexión personal.*

### Paso 3: Sembrado de Datos Iniciales (Seed)
El caso de estudio solicita iniciar con géneros específicos (acción, aventura, ciencia ficción, drama y terror) y tipos específicos (serie y película). Para poblar estos datos automáticamente en la base de datos, ejecuta:
```bash
npm run seed
```

### Paso 4: Iniciar el Servidor
Para iniciar el servidor en modo producción:
```bash
npm start
```
Para iniciar el servidor en modo desarrollo con recarga automática en caliente (`nodemon`):
```bash
npm run dev
```
El servidor se iniciará en `http://localhost:4000`.

---

## 3. Catálogo de Servicios y Endpoints (API REST)

Todas las rutas están bajo el prefijo `/api`.

### A. Módulo de Géneros (`/api/genres`)
*   `GET /api/genres` - Obtener todos los géneros (ordenados por fecha de creación descendente).
*   `GET /api/genres/:id` - Obtener un género específico por su ID.
*   `POST /api/genres` - Registrar un nuevo género.
    *   *Payload:* `{ "nombre": "Fantasía", "estado": "Activo", "descripcion": "..." }`
*   `PUT /api/genres/:id` - Editar un género existente.
*   `DELETE /api/genres/:id` - Eliminar un género.

### B. Módulo de Directores (`/api/directors`)
*   `GET /api/directors` - Obtener todos los directores.
*   `GET /api/directors/:id` - Obtener un director por ID.
*   `POST /api/directors` - Registrar un director.
    *   *Payload:* `{ "nombres": "Steven Spielberg", "estado": "Activo" }`
*   `PUT /api/directors/:id` - Actualizar un director.
*   `DELETE /api/directors/:id` - Eliminar un director.

### C. Módulo de Productoras (`/api/producers`)
*   `GET /api/producers` - Obtener todas las productoras.
*   `GET /api/producers/:id` - Obtener productora por ID.
*   `POST /api/producers` - Registrar una productora.
    *   *Payload:* `{ "nombre": "Universal Pictures", "estado": "Activo", "slogan": "...", "descripcion": "..." }`
*   `PUT /api/producers/:id` - Actualizar productora.
*   `DELETE /api/producers/:id` - Eliminar productora.

### D. Módulo de Tipos (`/api/types`)
*   `GET /api/types` - Obtener todos los tipos de multimedia.
*   `GET /api/types/:id` - Obtener tipo por ID.
*   `POST /api/types` - Registrar un tipo.
    *   *Payload:* `{ "nombre": "Documental", "descripcion": "..." }`
*   `PUT /api/types/:id` - Actualizar tipo.
*   `DELETE /api/types/:id` - Eliminar tipo.

### E. Módulo de Media (`/api/media`)
*   `GET /api/media` - Obtiene todas las películas y series registradas, poblando los detalles de su género, director, productora y tipo.
*   `GET /api/media/:id` - Obtener una película o serie por ID con sus relaciones.
*   `POST /api/media` - Registrar una nueva producción.
    *   *Reglas de Negocio:* Valida que el `serial` y la `url` sean únicos. Además, **valida que el género, director y productora seleccionados existan en la base de datos y estén en estado 'Activo'**. Si alguno de estos campos está marcado como 'Inactivo', la API rechazará la creación con un error `400 Bad Request`.
    *   *Payload:*
        ```json
        {
          "serial": "M-2026",
          "titulo": "Inception",
          "sinopsis": "Un ladrón que roba secretos corporativos a través del uso de la tecnología...",
          "url": "https://play.iudmovies.edu.co/watch/inception",
          "imagenPortada": "https://play.iudmovies.edu.co/covers/inception.jpg",
          "anioEstreno": 2010,
          "generoPrincipal": "ID_DE_GENERO_ACTIVO",
          "directorPrincipal": "ID_DE_DIRECTOR_ACTIVO",
          "productora": "ID_DE_PRODUCTORA_ACTIVA",
          "tipo": "ID_DE_TIPO"
        }
        ```
*   `PUT /api/media/:id` - Actualizar datos de una producción (aplica las mismas validaciones de llave foránea activa si se modifican las relaciones).
*   `DELETE /api/media/:id` - Eliminar una producción.

---

## 4. Pruebas y Validación (Postman)

Se ha incluido el archivo `postman_collection.json` en la raíz del proyecto. Para probar la API:
1.  Abre Postman (o Thunder Client).
2.  Haz clic en **Import** y selecciona el archivo `postman_collection.json`.
3.  La colección incluye todas las peticiones organizadas por módulos, listas para ejecutarse apuntando a `http://localhost:4000`.
4.  *Nota:* Recuerda copiar los IDs (`_id`) de los géneros, directores, productoras y tipos creados en tu base de datos y reemplazarlos en el JSON body de las peticiones del módulo de Media para probar los flujos exitosos y de error.

---

## 5. Conclusiones

*   **Arquitectura Desacoplada y RESTful**: La separación de responsabilidades en rutas, controladores y modelos bajo la arquitectura REST permite que la aplicación Backend se desarrolle de manera independiente al Frontend, facilitando el mantenimiento y escalabilidad del software.
*   **Integridad de Datos en Bases NoSQL**: A pesar de que MongoDB es una base de datos no relacional y flexible, a través de la lógica del servidor (desarrollada en Express) y Mongoose se logró implementar una sólida integridad referencial y lógica de negocio (validar estados Activos), asegurando la consistencia de los datos del sistema escolar de entretenimiento.
*   **Simplicidad del Lado del Servidor**: Node.js provee una ejecución asíncrona no bloqueante óptima para APIs REST que manejan múltiples peticiones de lectura y escritura concurrentes, ideal para plataformas de streaming o catálogos multimedia.
