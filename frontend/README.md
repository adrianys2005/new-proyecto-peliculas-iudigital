# Evidencia de Aprendizaje 2: Aplicación Web en ReactJs
## Ingeniería Web II - Institución Universitaria Digital de Antioquia (IUDigital)

Esta aplicación web Frontend ha sido desarrollada con **React.js** para interactuar con la API REST (Backend en Node.js) creada en la Evidencia de Aprendizaje 1, cumpliendo con todos los requerimientos del caso de estudio de la IUDigital de Antioquia.

---

## 1. Arquitectura y Tecnologías Utilizadas

*   **React 18**: Biblioteca principal para la construcción de interfaces de usuario basadas en componentes reactivos y Hooks (`useState`, `useEffect`).
*   **Vite**: Herramienta de compilación y empaquetado ultrarrápido.
*   **Axios**: Cliente HTTP para el consumo de los servicios REST de la API.
*   **React Router DOM v6**: Enrutamiento SPA (Single Page Application) para la navegación fluida entre los 5 módulos sin recargar la página.
*   **Bootstrap 5 & Bootstrap Icons**: Diseño visual moderno, responsivo y adaptado a una temática oscura cinematográfica ("tipo Cuevana").
*   **SweetAlert2**: Notificaciones interactivas y modales de confirmación para una excelente experiencia de usuario (UX).

---

## 2. Estructura de Pantallas y Módulos Desarrollados

La aplicación cuenta con 5 pantallas principales accesibles desde la barra de navegación superior:

### 🎬 A. Módulo de Media - Películas y Series (`/`)
*   **Catálogo Visual**: Grid de tarjetas dinámicas con póster, título, sinopsis, año de estreno, tipo de multimedia y badges de género.
*   **Información de Créditos**: Muestra los nombres del **Director Principal** y de la **Casa Productora** obtenidos mediante la población relacional de la API.
*   **Formulario Modal**: Permite registrar y editar producciones.
*   **Validación de Negocio en Frontend**: Los menús desplegables (*selects*) cargan y permiten seleccionar **únicamente géneros, directores y productoras en estado 'Activo'**, garantizando la coherencia e integridad de los datos antes y durante el envío a la API.
*   **Buscador y Filtros**: Barra de búsqueda interactiva por título o género y filtro por tipo de contenido.

### 🏷️ B. Módulo de Géneros (`/generos`)
*   Tabla de consulta con columnas: Nombre, Estado (badge de Activo/Inactivo), Descripción, Fecha de Creación y Acciones.
*   Modal interactivo para **Crear** y **Editar** géneros cinematográficos.
*   Confirmación de eliminación con SweetAlert2.

### 🎥 C. Módulo de Directores (`/directores`)
*   Tabla de consulta de directores principales con nombre, estado, fecha de registro y acciones.
*   Formulario modal para **Crear** y **Editar** directores de cine.

### 🏢 D. Módulo de Productoras (`/productoras`)
*   Tabla de consulta de casas productoras con nombre, estado, slogan de la empresa, descripción y acciones.
*   Formulario modal para **Crear** y **Editar** productoras.

### 🎞️ E. Módulo de Tipos (`/tipos`)
*   Tabla de consulta para las clasificaciones multimedia (Película, Serie, etc.) con nombre, descripción y acciones.
*   Formulario modal para **Crear** y **Editar** tipos.

---

## 3. Instrucciones para Ejecutar el Proyecto Completo

Para ejecutar tanto el Backend como el Frontend en tu computadora:

### Paso 1: Iniciar el Backend (API REST)
1. Abre una terminal en la carpeta `backend/`:
   ```bash
   cd backend
   npm start
   ```
2. El servidor API estará escuchando en `http://localhost:4000`.

### Paso 2: Iniciar el Frontend (React.js)
1. Abre otra terminal en la carpeta `frontend/`:
   ```bash
   cd frontend
   npm run dev
   ```
2. La aplicación web estará disponible en `http://localhost:3000`.

---

## 4. Conclusiones

*   **Desacoplamiento Efectivo**: La arquitectura cliente-servidor separa claramente las responsabilidades del Frontend (React.js) y del Backend (Node.js/Express), permitiendo actualizar la interfaz de usuario sin alterar la lógica de negocio ni la base de datos.
*   **Integridad de Datos Multicapa**: Tanto el Frontend (filtrando solo opciones activas en los selectores) como el Backend (verificando en base de datos que el género, director y productora estén activos) cooperan para garantizar que ninguna producción se guarde con relaciones inválidas.
*   **Experiencia de Usuario Optimizada**: El uso de componentes reactivos, modales y alertas visuales con SweetAlert2 proporciona una navegación fluida, rápida e intuitiva adecuada para plataformas de streaming multimedia.
