# Aplicación Web para Gestión de Películas y Series (Tipo Streaming)
## Institución Universitaria Digital de Antioquia — IU Digital
### Asignatura: Ingeniería Web II

---

## Portada y Datos del Proyecto
* **Proyecto:** Sistema de Administración y Publicación de Contenidos Multimedia (Películas y Series) — *"IUDigital Play"*.
* **Actividades Integradas:**
  * **EA1:** API REST con Node.js, Express y MongoDB (Backend).
  * **EA2:** Aplicación Web Interactiva con React.js, Bootstrap y Axios (Frontend).
* **Arquitectura:** Arquitectura Cliente-Servidor desacoplada (Frontend independiente de Backend).
* **Año Académico:** 2026

---

## 1. Introducción y Contexto del Caso de Estudio

La **Institución Universitaria Digital de Antioquia (IU Digital)** requirió el diseño y desarrollo de una aplicación web centralizada ("desde cero") para la administración y publicación de contenidos de entretenimiento audiovisual en modo administrador. El objetivo de la plataforma es permitir a los administradores gestionar un catálogo de películas y series licenciadas de forma organizada, accesible y estructurada.

Para abordar este reto, el sistema se diseñó bajo una **arquitectura desacoplada**, donde el **Backend** implementa una API RESTful sólida y con reglas de integridad relacional, mientras que el **Frontend** ofrece una interfaz de usuario reactiva, moderna y adaptativa inspirada en plataformas de streaming líderes.

---

## 2. Objetivos del Proyecto

### Objetivo General
Desarrollar una solución web FullStack (Backend API REST en Node.js y Frontend en React.js) que permita la gestión completa (CRUD) de los 5 módulos del catálogo multimedia: **Género, Director, Productora, Tipo y Media**.

### Objetivos Específicos
1. Diseñar el modelo de datos y las relaciones entre entidades audiovisuales.
2. Construir los endpoints HTTP (GET, POST, PUT, DELETE) con control de errores y respuestas en formato JSON.
3. Implementar la regla de negocio crítica: **Una película o serie solo puede ser registrada o actualizada si su Género, Director y Productora asociados existen y se encuentran en estado 'Activo'**.
4. Crear una interfaz web interactiva en React.js con diseño responsivo oscuro (Bootstrap 5) y alertas interactivas (SweetAlert2).
5. Proveer mecanismos de base de datos resilientes (soporte tanto para MongoDB/Mongoose como para base de datos local en archivos JSON para ejecución inmediata sin dependencias externas).

---

## 3. Arquitectura del Sistema

```
  ┌─────────────────────────────────────────────────────────────┐
  │                 FRONTEND (React.js + Vite)                  │
  │                  Puerto Local: http://localhost:3000        │
  │                                                             │
  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐  │
  │  │ MediaView  │ │ GenreView  │ │DirectorView│ │Producer..│  │
  │  └─────┬──────┘ └─────┬──────┘ └─────┬──────┘ └────┬─────┘  │
  │        └──────────────┴───────┬──────┴─────────────┘        │
  │                        Axios HTTP Client                    │
  └───────────────────────────────┼─────────────────────────────┘
                                  │ Peticiones JSON (CORS)
                                  ▼
  ┌─────────────────────────────────────────────────────────────┐
  │                 BACKEND (Node.js + Express)                 │
  │                  Puerto Local: http://localhost:4000        │
  │                                                             │
  │  ┌──────────────┐ ┌──────────────┐ ┌─────────────────────┐  │
  │  │ /api/genres  │ │/api/directors│ │ /api/media (CRUD)   │  │
  │  └──────┬───────┘ └──────┬───────┘ └──────────┬──────────┘  │
  │         └────────────────┼────────────────────┘             │
  │                 Validaciones de Negocio                     │
  │               (Verificación de Estado Activo)               │
  └──────────────────────────┬──────────────────────────────────┘
                             │
                             ▼
  ┌─────────────────────────────────────────────────────────────┐
  │                        BASE DE DATOS                        │
  │  • MongoDB / Mongoose (Cluster Atlas o Local)               │
  │  • Motor de Simulación Local JSON (Modo Offline)           │
  └─────────────────────────────────────────────────────────────┘
```

---

## 4. Descripción Detallada de los 5 Módulos

### 4.1. Módulo de Géneros (`Genre`)
* **Propósito:** Categorizar las producciones cinematográficas (ej. Acción, Aventura, Ciencia Ficción, Drama, Terror, etc.).
* **Estructura de Datos:**
  * `nombre` (String, Obligatorio, Único).
  * `estado` (Enum: 'Activo' | 'Inactivo', por defecto 'Activo').
  * `descripcion` (String).
  * `fechaCreacion` / `fechaActualizacion` (Control automático de marcas temporales).
* **Endpoints Backend:** `GET`, `POST`, `PUT`, `DELETE` en `/api/genres`.
* **Pantalla Frontend:** Ruta `/generos` con tabla interactiva, badges de color según estado y modal de edición/creación.

### 4.2. Módulo de Directores (`Director`)
* **Propósito:** Registrar al director principal de cada obra audiovisual.
* **Estructura de Datos:**
  * `nombres` (String, Obligatorio).
  * `estado` (Enum: 'Activo' | 'Inactivo', por defecto 'Activo').
  * `fechaCreacion` / `fechaActualizacion`.
* **Endpoints Backend:** `GET`, `POST`, `PUT`, `DELETE` en `/api/directors`.
* **Pantalla Frontend:** Ruta `/directores` con listado y modal de gestión.

### 4.3. Módulo de Productoras (`Producer`)
* **Propósito:** Gestionar los estudios y casas productoras (Disney, Warner Bros, Paramount, MGM, Universal, etc.).
* **Estructura de Datos:**
  * `nombre` (String, Obligatorio, Único).
  * `estado` (Enum: 'Activo' | 'Inactivo', por defecto 'Activo').
  * `slogan` (String).
  * `descripcion` (String).
  * `fechaCreacion` / `fechaActualizacion`.
* **Endpoints Backend:** `GET`, `POST`, `PUT`, `DELETE` en `/api/producers`.
* **Pantalla Frontend:** Ruta `/productoras` con visualización de slogans y modales interactivos.

### 4.4. Módulo de Tipos (`Type`)
* **Propósito:** Definir el formato del contenido multimedia (ej. Película, Serie, Miniserie, Documental).
* **Estructura de Datos:**
  * `nombre` (String, Obligatorio, Único).
  * `descripcion` (String).
  * `fechaCreacion` / `fechaActualizacion`.
* **Endpoints Backend:** `GET`, `POST`, `PUT`, `DELETE` en `/api/types`.
* **Pantalla Frontend:** Ruta `/tipos` con listado clasificado y gestión modal.

### 4.5. Módulo de Media — Películas y Series (`Media`)
* **Propósito:** Publicar y administrar el catálogo audiovisual vinculando los 4 módulos anteriores.
* **Estructura de Datos:**
  * `serial` (String, Obligatorio, Único).
  * `titulo` (String, Obligatorio).
  * `sinopsis` (String).
  * `url` (String, Obligatoria, Única).
  * `imagenPortada` (String, URL de imagen o póster).
  * `anioEstreno` (Number, Obligatorio).
  * `generoPrincipal` (Referencia FK a `Genre` — **Validado Activo**).
  * `directorPrincipal` (Referencia FK a `Director` — **Validado Activo**).
  * `productora` (Referencia FK a `Producer` — **Validada Activa**).
  * `tipo` (Referencia FK a `Type`).
  * `fechaCreacion` / `fechaActualizacion`.
* **Validación Crítica de Negocio:** El controlador en `backend/routes/mediaRoutes.js` verifica asíncronamente que el género, director y productora seleccionados no solo existan, sino que su propiedad `estado === 'Activo'`. En caso contrario, deniega la operación con código HTTP `400 Bad Request`.
* **Pantalla Frontend:** Ruta principal `/` con catálogo tipo tarjetas visuales, póster, buscador en tiempo real, filtro por tipo y modal con menús desplegables que cargan únicamente opciones activas.

---

## 5. Guía de Instalación y Ejecución Local

### Requisitos Previos
* **Node.js** (versión v16 o superior).
* Navegador web moderno (Chrome, Edge, Firefox).

---

### Paso 1: Clonar o Descargar el Proyecto
Asegúrate de tener la estructura del proyecto en tu máquina:
```text
PROYECTO/
├── backend/       # Código de la API REST Node.js
├── frontend/      # Código de la aplicación React.js
├── README.md      # Este documento
└── .gitignore
```

---

### Paso 2: Ejecutar el Backend (Servidor API)
1. Abre una terminal y navega a la carpeta `backend`:
   ```bash
   cd backend
   ```
2. Instala las dependencias (si no se han instalado):
   ```bash
   npm install
   ```
3. *(Opcional)* Poblar la base de datos con los géneros iniciales obligatorios (*acción, aventura, ciencia ficción, drama, terror*) y tipos (*película, serie*):
   ```bash
   npm run seed
   ```
4. Iniciar el servidor API:
   ```bash
   npm start
   ```
   *(El servidor iniciará en `http://localhost:4000` con la base de datos lista).*

---

### Paso 3: Ejecutar el Frontend (Aplicación React)
1. Abre una segunda terminal y navega a la carpeta `frontend`:
   ```bash
   cd frontend
   ```
2. Instala las dependencias (si no se han instalado):
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo Vite:
   ```bash
   npm run dev
   ```
4. Abre tu navegador en **`http://localhost:3000`** para interactuar con la aplicación web completa.

---

## 6. Pruebas y Validación de la Solución

### Pruebas Automatizadas Integradas (`backend/test-api.js`)
El backend cuenta con un script de prueba de integración que valida todos los endpoints en secuencia:
```bash
cd backend
node test-api.js
```
**Resultados verificados:**
* ✅ Creación y listado de géneros, directores, productoras y tipos.
* ✅ Registro exitoso de una película (*Jurassic Park*) con todas las relaciones activas.
* ✅ **Rechazo exitoso (Error 400)** al intentar registrar una producción con un género marcado como *Inactivo*.
* ✅ Poblado relacional (*populate*) que retorna los nombres y objetos completos de directores y productoras en lugar de solo IDs.

### Pruebas con Postman / Thunder Client
El archivo `backend/postman_collection.json` incluye 17 peticiones HTTP estructuradas y listas para importar y probar en Postman.

---

## 7. Estructura de Archivos del Repositorio

```text
DESARROLLO WEB/
├── backend/
│   ├── config/
│   │   └── db.js                 # Configuración de conexión a MongoDB / Mongoose
│   ├── models/
│   │   ├── Genre.js              # Esquema de Género
│   │   ├── Director.js           # Esquema de Director
│   │   ├── Producer.js           # Esquema de Productora
│   │   ├── Type.js               # Esquema de Tipo
│   │   ├── Media.js              # Esquema de Películas/Series con referencias
│   │   └── MockModel.js          # Motor de simulación para modo offline
│   ├── routes/
│   │   ├── genreRoutes.js        # CRUD Géneros
│   │   ├── directorRoutes.js     # CRUD Directores
│   │   ├── producerRoutes.js     # CRUD Productoras
│   │   ├── typeRoutes.js         # CRUD Tipos
│   │   └── mediaRoutes.js        # CRUD Media con validaciones de estado Activo
│   ├── scripts/
│   │   └── seed.js               # Semillero de datos iniciales
│   ├── .env                      # Variables de entorno (Puerto y URI)
│   ├── package.json              # Dependencias del Backend
│   ├── server.js                 # Punto de entrada de la API Express
│   ├── postman_collection.json   # Colección de pruebas de Postman
│   ├── test-api.js               # Script de pruebas automatizadas
│   └── README.md                 # Documentación técnica del Backend
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Barra de navegación superior
│   │   │   └── MediaCard.jsx     # Tarjeta visual para el catálogo de películas
│   │   ├── views/
│   │   │   ├── MediaView.jsx     # Pantalla principal (Catálogo + Modal Media)
│   │   │   ├── GenreView.jsx     # Pantalla de Géneros
│   │   │   ├── DirectorView.jsx  # Pantalla de Directores
│   │   │   ├── ProducerView.jsx  # Pantalla de Productoras
│   │   │   └── TypeView.jsx      # Pantalla de Tipos
│   │   ├── services/
│   │   │   ├── api.js            # Instancia base de Axios
│   │   │   ├── genreService.js
│   │   │   ├── directorService.js
│   │   │   ├── producerService.js
│   │   │   ├── typeService.js
│   │   │   └── mediaService.js
│   │   ├── App.jsx               # Enrutador principal (React Router DOM)
│   │   ├── main.jsx              # Entrada React con Bootstrap
│   │   └── index.css             # Estilos de tema oscuro cinematográfico
│   ├── index.html
│   ├── package.json              # Dependencias del Frontend
│   ├── vite.config.js            # Configuración de Vite
│   └── README.md                 # Documentación técnica del Frontend
│
├── .gitignore                    # Exclusiones de Git
└── README.md                     # Documento principal del proyecto
```

---

## 8. Conclusiones

1. **Separación de Responsabilidades y Escalabilidad:** El desacoplamiento entre el cliente (React.js) y el servidor (Node.js/Express) garantiza una arquitectura mantenible, permitiendo evolucionar la interfaz visual o integrar nuevas plataformas clientes (móviles, Smart TVs) sin modificar la lógica del servidor.
2. **Garantía de Integridad en Múltiples Capas:** Se implementó una doble barrera de validación: preventiva en el Frontend (filtrando los desplegables para mostrar solo opciones activas) y coercitiva en el Backend (consultando la base de datos antes de permitir cualquier inserción o actualización de producciones).
3. **Experiencia de Usuario Optimizada (UX/UI):** El uso de Bootstrap 5 con tema oscuro, fuentes modernas, tarjetas interactivas y notificaciones con SweetAlert2 genera una experiencia inmersiva acorde a las expectativas de plataformas modernas de entretenimiento.
4. **Resiliencia y Flexibilidad de Despliegue:** La solución incluye soporte nativo para MongoDB/Mongoose y un motor emulador local en archivos JSON, permitiendo ejecutar y evaluar el proyecto tanto en entornos de nube como en máquinas locales sin necesidad de instalar bases de datos externas.
