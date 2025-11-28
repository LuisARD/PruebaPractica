# PruebaPractica
Sistema de Gestión de Productos, Clientes y Ventas

Aplicación fullstack para gestionar productos, clientes y ventas, con autenticación y panel administrativo.

Tecnologías Backend

C#, ASP.NET Core Web API (.NET 10)

SQL Server (con Entity Framework Core y Migrations)

JWT para autenticación

Arquitectura en capas:

Controllers

Services

Repositories

Data (DbContext)

Frontend

Vue 3 + Composition API + TypeScript

Vite

Axios para consumir la API

Ruteo con protección de rutas (login requerido)

Funcionalidades Principales Backend (API REST)

Entidades mínimas:

Productos: Id, Nombre, Descripcion, Precio, Stock

Clientes: Id, Nombre, Email, Telefono

Ventas: Id, Fecha, ClienteId, Total

Detalles de venta con productos y cantidades

Endpoints típicos (ejemplo):

POST /api/Auth/login – devuelve JWT

POST /api/Auth/register

GET /api/Productos – público

POST /api/Productos – protegido (JWT)

PUT /api/Productos/{id}, DELETE /api/Productos/{id}

Similar para /api/Clientes

/api/Ventas:

GET historial de ventas

POST registrar venta (con detalles)

DELETE eliminar venta

Manejo de errores: respuestas claras (400, 404, 500) y mensajes descriptivos para el frontend.

Frontend (Panel Administrativo)

Pantallas principales:

Login / Registro

Manejo de token JWT (localStorage)

Redirección según autenticación

Productos

Lista pública

Si estás logueado:

Crear, editar y eliminar productos

Modal para formulario de crear/editar

Clientes

CRUD de clientes (requiere login)

Modal para crear/editar

Ventas

Registro de nuevas ventas:

Selección de cliente

Selección de productos y cantidades

Cálculo de total

Historial de ventas:

Fecha, cliente, total y detalles

Eliminar ventas

Rutas protegidas con meta.requiresAuth y guard global que revisa el token. Instrucciones para Ejecutar el Proyecto

Clonar repositorio tanto ApiBackend como frontend-vue y corre lo siguiente:

En el ApiBackend necesitas acceder, configurar la nueva cadena de conexión en appsettings,json, aplicar las migraciones “dotnet ef database update” esto te creara las tablas y datos que se estarán utilizando, configurar tu puerto y correr el API con “dotnet run”.

En el frontend-vue necesitas instalar las dependencias de node con “npm install”, verificar el puerto del api y la conexión en el “services/ApiClient.ts” y correr el proyecto con el “npm run dev”.
