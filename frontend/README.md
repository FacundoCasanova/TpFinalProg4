# Frontend - Sistema de Gestión de Gimnasio

Aplicación web moderna desarrollada con **React**, **Vite** y **Material UI** para interactuar con la API de Gimnasio.

Esta interfaz cuenta con un diseño profesional (paleta de colores personalizada), autenticación segura y generación de reportes.

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- npm (incluido con Node.js)

## 🚀 Instalación

1. **Entrar a la carpeta del frontend:**

   ```bash

   cd frontend
   ```

Instalar dependencias:

Bash

npm install

\*\* Ejecución
Para iniciar la aplicación en modo desarrollo:

Bash

npm run dev

La aplicación estará disponible en: http://localhost:5173

\*\* Tecnologías y Librerías

React + Vite: Framework principal para un desarrollo rápido y optimizado.

Material UI (MUI v6): Componentes visuales modernos con tema personalizado.

Axios: Cliente HTTP para la comunicación con el Backend.

React Router: Manejo de navegación SPA y protección de rutas.

jsPDF + AutoTable: Generación de reportes de rutinas en formato PDF.

\*\* Funcionalidades Principales

-Autenticación Completa:

> Login y Registro integrados.

> Manejo de sesión persistente con JWT.

> Redirección inteligente tras el login.

> Dashboard (Mis Rutinas):

> Visualización de rutinas en tarjetas interactivas.

> Creación y eliminación de rutinas.

> Diseño responsive y amigable.

> Detalle de Entrenamiento:

> Gestión de ejercicios por día de la semana.

> Exportación a PDF: Descarga del plan de entrenamiento listo para imprimir.

\*\* Estructura del Proyecto

src/pages: Vistas principales (Login, Dashboard, DetalleRutina).

src/context: Lógica global de sesión (AuthContext).

src/theme.js: Configuración del tema visual (colores y tipografía).

src/App.jsx: Router principal.
