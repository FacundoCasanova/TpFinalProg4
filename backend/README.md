# Backend - Sistema de Gestión de Gimnasio

API RESTful desarrollada con **FastAPI** y **PostgreSQL** para la gestión de rutinas de entrenamiento.

## 📋 Requisitos Previos

- Python 3.10 o superior.
- PostgreSQL instalado y corriendo.

## 🚀 Instalación y Configuración

1. **Crear entorno virtual:**
   ```bash
   python -m venv venv
   ```

Activar entorno:

Windows: venv\Scripts\activate

Mac/Linux: source venv/bin/activate

Instalar dependencias:

pip install fastapi uvicorn sqlmodel psycopg2-binary python-dotenv pydantic python-jose[cryptography] passlib[bcrypt] python-multipart

Configurar Base de Datos:

Crea una base de datos en PostgreSQL llamada gym_db.

Crea un archivo .env en la carpeta backend con el siguiente contenido:

Fragmento de código

DATABASE_URL=postgresql://postgres:1234@localhost:5433/gym_db
SECRET_KEY=clave_secreta_super_segura_para_el_tp_final_2025
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

\*\* Ejecución
Para iniciar el servidor en modo desarrollo (con recarga automática):

Bash

python -m uvicorn main:app --reload

Documentación Interactiva (Swagger UI): http://127.0.0.1:8000/docs

URL Base de la API: http://127.0.0.1:8000

\*\* Endpoints Principales

-Autenticación:

POST /registro: Registrar un nuevo usuario.

POST /token: Iniciar sesión y obtener token JWT.

-Rutinas:

GET /rutinas: Obtener todas las rutinas del usuario logueado.

POST /rutinas: Crear una nueva rutina.

DELETE /rutinas/{id}: Eliminar una rutina.

-Ejercicios:

GET /ejercicios/{rutina_id}: Ver ejercicios de una rutina.

POST /ejercicios: Agregar ejercicio.

\*\* Estructura del Proyecto

main.py: Punto de entrada, configuración de CORS y rutas.

models.py: Definición de tablas (Usuario, Rutina, Ejercicio) con SQLModel.

auth.py: Lógica de seguridad (Hashing de contraseñas y JWT).

database.py: Conexión a la base de datos.

rutinas.py / ejercicios.py: Routers con la lógica de negocio.|
